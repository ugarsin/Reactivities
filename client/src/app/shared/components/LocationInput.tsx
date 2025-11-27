import {
  Box,
  TextField,
  List,
  ListItemButton,
  CircularProgress,
  Typography,
  type TextFieldProps,
  debounce
} from "@mui/material";
import {
  useController,
  type FieldValues,
  type UseControllerProps
} from "react-hook-form";
import { useMemo, useState } from "react";
import type { LocationIQSuggestion } from "../../../lib/types";
import axios from "axios";

type LocationInputProps<T extends FieldValues> =
  UseControllerProps<T> &
  Omit<TextFieldProps, "name" | "defaultValue" | "value" | "onChange" | "onBlur"> & {
    label: string;
  };

export default function LocationInput<T extends FieldValues>(
  props: LocationInputProps<T>
) {
  // const [debounceTimer, setDebounceTimer] = useState<number>();
  const { name, control, rules, label, ...muiProps } = props;

  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useMemo(
    () => debounce(
      async (query: string) => {
        if (!query || query.length < 3) {
          setSuggestions([]);
          return;
        }
        setLoading(true);
        try {
          const url = `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&limit=5&dedupe=1&`;
          const res = await axios.get<LocationIQSuggestion[]>(url);
          setSuggestions(res.data);
        } catch (err) {
          console.error("LocationIQ error:", err);
        } finally {
          setLoading(false);
        }
      }, 
      500
    ), 
    []
  );

  const handleChange = async (value: string) => {
    field.onChange({
      venue: value,
      latitude: field.value?.latitude ?? 0,
      longitude: field.value?.longitude ?? 0,
    });
    await fetchSuggestions(value);
  }

  const handleSelect = (location: LocationIQSuggestion) => {
    const city = location.address?.city || location.address?.town || location.address?.village;
    const venue = location.display_name;
    const latitude = Number(location.lat);
    const longitude = Number(location.lon);
    field.onChange(
      {
        city,
        venue,
        latitude,
        longitude
      }
    );
    setSuggestions([]);
  }

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        {...muiProps}
        value={field.value?.venue ?? ""}
        label={label}
        fullWidth
        variant="outlined"
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        onChange={(e) => {handleChange(e.target.value)}}
      />
      {/* Loading indicator */}
      {loading && (
        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <CircularProgress size={18} />
          <Typography variant="body2">Searching...</Typography>
        </Box>
      )}
      {/* Suggestions dropdown */}
      {!loading && suggestions.length > 0 && (
        <List
          sx={{
            position: "absolute",
            width: "100%",
            bgcolor: "white",
            zIndex: 20,
            border: "1px solid #ccc",
            borderRadius: 1,
            maxHeight: 250,
            overflowY: "auto",
            mt: 1,
          }}
        >
          {suggestions.map((s, index) => (
            <ListItemButton
              key={`${s.place_id}-${index}`}
              divider
              onClick={() => {handleSelect(s);}}
            >
              {s.display_name}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
