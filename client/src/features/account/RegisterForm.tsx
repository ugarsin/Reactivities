import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../lib/hooks/useAccount"
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { Box, Button, Paper, Typography } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { useForm } from "react-hook-form";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function RegisterForm() {
  const { registerUser } = useAccount();
  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async (data: RegisterSchema) => {
    await registerUser.mutateAsync(data);
  }
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 3,
        gap: 3,
        maxWidth: "md",
        mx: "auto",
        borderRadius: 3
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={3}
        color="secondary.main"
      >
        <PersonAddIcon fontSize="large"></PersonAddIcon>
        <Typography variant="h4">Register</Typography>
      </Box>
      <TextInput autoComplete="off" label="Name" control={control} name="displayName" />
      <TextInput autoComplete="off" label="Email" control={control} name="email" />
      <TextInput autoComplete="off" label="Password" type="password" control={control} name="password" />
      <TextInput autoComplete="off" label="Confirm password" type="password" control={control} name="confirmPassword" />
      <Button
        type="submit"
        disabled={!isValid}
        variant="contained"
        size="large"
      >
        Register
      </Button>
    </Paper>
  )
}
