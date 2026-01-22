import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SettingsIcon from "@mui/icons-material/Settings";

const Admin = () => {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mt={6} mb={6}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 72,
            height: 72,
            mx: "auto",
            mb: 2,
          }}
        >
          <AdminPanelSettingsIcon fontSize="large" />
        </Avatar>

        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Manage users, audio jobs, and system settings
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="center"
      >
        {[
          {
            icon: <PeopleIcon sx={{ color: "primary.main" }} />,
            title: "Users",
            desc: "View and manage registered users",
          },
          {
            icon: <AudiotrackIcon sx={{ color: "primary.main" }} />,
            title: "Audio Jobs",
            desc: "Monitor conversions and processing status",
          },
          {
            icon: <SettingsIcon sx={{ color: "primary.main" }} />,
            title: "System Settings",
            desc: "Configure limits and processing rules",
          },
        ].map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: 1,
              textAlign: "center",
              p: 3,
              borderRadius: 3,
              transition: "0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  color: "primary.main",
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

              <Typography variant="body2" color="text.secondary" mt={1}>
                {item.desc}
              </Typography>

              <Button variant="outlined" size="small" sx={{ mt: 3 }}>
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Admin;
