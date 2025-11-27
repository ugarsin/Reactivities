import { DateTimePicker } from "@mui/x-date-pickers";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import dayjs from "dayjs";

type DateTimeInputProps<TForm extends FieldValues> =
  UseControllerProps<TForm> & {
    label: string;
  };

export default function DateTimeInput<TForm extends FieldValues>(
  props: DateTimeInputProps<TForm>
) {
  const { name, control, rules, label, ...rest } = props;

  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  return (
    <DateTimePicker
      {...rest}
      label={label}
      value={field.value ? dayjs(field.value) : null}
      onChange={(value) => field.onChange(value?.toISOString() ?? "")}
      slotProps={{
        textField: {
          fullWidth: true,
          onBlur: field.onBlur,
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
        },
      }}
    />
  );
}
