import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy"; 
import {
  ContentCut as ContentCutIcon,
  UploadFile as UploadFileIcon,
  Audiotrack as AudiotrackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Audio() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box py={2}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome Back
          </Typography>
          <Typography color="text.secondary">
            Upload media, extract audio automatically, and create the perfect clip.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 } }}>
              <CardContent>
                <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Upload
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Video or Audio files
                </Typography>
                <Chip label="Step 1" size="small" variant="outlined" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 } }}>
              <CardContent>
                <ContentCutIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Trim
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  FFmpeg Processing
                </Typography>
                <Chip label="Step 2" size="small" variant="outlined" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%', textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 } }}>
              <CardContent>
                <AudiotrackIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Download
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  High quality MP3
                </Typography>
                <Chip label="Step 3" size="small" variant="outlined" />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={8} textAlign="center">
          <Button
            size="large"
            variant="contained"
            startIcon={<ContentCutIcon />}
            sx={{ px: 8, py: 2, borderRadius: 2, fontSize: '1.1rem' }}
            onClick={() => navigate("/audio-trim")}
          >
            Go to Audio Trimmer
          </Button>
        </Box>
      </Box>
    </Container>
  );
}