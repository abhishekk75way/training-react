import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink } from "react-router-dom";
import { forgotPassword } from "@/services/api";
import { toast } from "react-toastify";
import axios from "axios";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

  const onSubmit = async (data: ForgotPasswordFormData) => {
  try {
    await forgotPassword({ email: data.email });

    toast.success(capitalize("check your email for the reset link"), {
      autoClose: 4000,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } catch (error) {
    let message = "error sending reset link";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        message;
    }

    toast.error(capitalize(message), {
      autoClose: 4000,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
              <LockResetOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              Forgot password?
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Enter your email and we’ll send you a password reset link
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3, py: 1.2 }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Remember your password?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
