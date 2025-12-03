import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type TextInputProps<T extends FieldValues> =
  UseControllerProps<T> &
  Omit<TextFieldProps, "name" | "defaultValue" | "value" | "onChange" | "onBlur">;

export default function TextInput<T extends FieldValues>(props: TextInputProps<T>) {
  const { name, control, rules, ...muiProps } = props;
  const { field, fieldState } = useController({ 
    name, 
    control, 
    rules
  });

  return (
    <TextField
      {...field}
      {...muiProps}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}