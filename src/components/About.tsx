import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DownloadIcon from "@mui/icons-material/Download";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Audio Trim
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Convert, trim, and download high-quality audio effortlessly
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 600,
              px: 4,
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
            onClick={() => navigate("/audio-trim")}
          >
            Start Trimming
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box py={8}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            Why Choose Audio Trim?
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <CloudUploadIcon />,
                title: "Easy Upload",
                desc: "Drag & drop audio or video files with multi-file support.",
              },
              {
                icon: <ContentCutIcon />,
                title: "Precise Trimming",
                desc: "Accurate server-side FFmpeg processing.",
              },
              {
                icon: <SpeedIcon />,
                title: "Fast Processing",
                desc: "Background jobs with live status updates.",
              },
              {
                icon: <SecurityIcon />,
                title: "Secure & Private",
                desc: "Files are processed securely and never shared.",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 10,
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        width: 56,
                        height: 56,
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <Typography variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={5}>
            How It Works
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <CloudUploadIcon />,
                text: "Upload your audio or video",
              },
              {
                icon: <AudiotrackIcon />,
                text: "Audio is extracted automatically",
              },
              {
                icon: <ContentCutIcon />,
                text: "Trim audio precisely",
              },
              {
                icon: <DownloadIcon />,
                text: "Download the final file",
              },
            ].map((step, i) => (
              <Grid xs={12} sm={6} md={3} key={i}>
                <Stack
                  alignItems="center"
                  spacing={2}
                  sx={{ textAlign: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 56,
                      height: 56,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography fontWeight={500}>{step.text}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box py={8}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Upload your files and get high-quality trimmed audio in seconds.
          </Typography>

          <Button
            size="large"
            variant="contained"
            sx={{ px: 5, py: 1.5 }}
            onClick={() => navigate("/audio-trim")}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
