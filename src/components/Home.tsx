import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          animation: "fadeIn 0.8s ease-in-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Stack spacing={4}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to App
          </Typography>

          <Typography color="text.secondary" maxWidth={500} mx="auto">
            Convert, trim, and manage your audio files effortlessly with a
            clean and powerful workflow.
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate("/audio")}
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #1976d2, #42a5f5)",
                boxShadow: "0 8px 20px rgba(25,118,210,0.35)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 25px rgba(25,118,210,0.45)",
                },
              }}
            >
              Continue
            </Button>

            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate("/about")}
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
