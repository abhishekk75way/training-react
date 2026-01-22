import {
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
  ContentCut as AudioTrimIcon,
  Audiotrack as AudioIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();

  const apps = [
    {
      title: "Dashboard",
      description: "View your workspace and recent activity",
      icon: <DashboardIcon sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      bgColor: "#f5f9ff",
      action: () => {},
    },
    {
      title: "Audio App",
      description: "Upload, trim, and process audio files with advanced controls",
      icon: <AudioTrimIcon sx={{ fontSize: 32 }} />,
      color: "#388e3c",
      bgColor: "#f1f8f4",
      action: () => navigate("/audio-app"),
    },
    {
      title: "Audio Files",
      description: "Manage and access your audio library with search and filters",
      icon: <AudioIcon sx={{ fontSize: 32 }} />,
      color: "#0288d1",
      bgColor: "#f0f8ff",
      action: () => navigate("/audio-trim", { state: { tab: 1 } }),
    },
  ];

  return (
    <Container maxWidth="md">
        {/* Apps Grid */}
        <Grid container spacing={3}>
          {apps.map((app, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1.5,
                  transition: "all 0.2s ease",
                  cursor: app.title !== "Dashboard" ? "pointer" : "default",
                  backgroundColor: app.bgColor,
                  "&:hover": {
                    borderColor: app.color,
                    backgroundColor: app.title !== "Dashboard" ? app.bgColor : app.bgColor,
                  },
                }}
                onClick={app.action}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    {/* Icon */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        backgroundColor: app.color,
                        borderRadius: 1.5,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {app.icon}
                    </Box>

                    {/* Content */}
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6" fontWeight={700}>
                          {app.title}
                        </Typography>
                        {app.title === "Dashboard" && (
                          <Chip label="Current" size="small" variant="outlined" sx={{ height: 24 }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {app.description}
                      </Typography>
                    </Box>

                    {/* Arrow */}
                    {app.title !== "Dashboard" && (
                      <ArrowIcon sx={{ color: theme.palette.text.secondary, mt: 0.5 }} />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
    </Container>
  );
}