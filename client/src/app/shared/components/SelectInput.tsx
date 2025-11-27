import { FormControl, FormHelperText, InputLabel, MenuItem, Select, } from "@mui/material";
import type { SelectProps } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps, } from "react-hook-form";

type SelectInputProps<T extends FieldValues> =
  UseControllerProps<T> & {
    label: string;
    items: { text: string; value: string }[];
  } 
  & 
  Omit<
    SelectProps,
    "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "label"
  >;

export default function SelectInput<T extends FieldValues>(
  props: SelectInputProps<T>
) {
  const { name, control, rules, items, label } = props;
  const { field, fieldState } = useController({ name, control, rules });

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
