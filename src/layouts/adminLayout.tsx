import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Divider, Tabs, Tab
} from "@mui/material";
import {
  Home as HomeIcon,
  ContentCut as ContentCutIcon,
  Settings as AdminIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { logout } from "@/store/authSlice";

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login", { replace: true });
  };

  // Apps structure for admin
  const apps = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <HomeIcon />, 
      path: "/dashboard" 
    },
    { 
      id: "audio-app", 
      label: "Audio App", 
      icon: <ContentCutIcon />, 
      path: "/audio-app" 
    },
    { 
      id: "admin", 
      label: "Admin", 
      icon: <AdminIcon />, 
      path: "/admin" 
    },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/dashboard") return "dashboard";
    if (location.pathname.startsWith("/audio")) return "audio-app";
    if (location.pathname.startsWith("/admin")) return "admin";
    return "admin";
  };

  const handleTabChange = (app: any) => {
    navigate(app.path, { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* --- STATIC SIDEBAR --- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Toolbar>
          <Typography variant="h6" fontWeight={700} color="primary">
            App Studio
          </Typography>
        </Toolbar>

        <Divider />

        {/* Apps Tabs */}
        <Box sx={{ px: 1, pt: 2 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ px: 1 }}>
            APPS
          </Typography>
          <Tabs
            value={getActiveTab()}
            onChange={(_, newValue) => {
              const app = apps.find(a => a.id === newValue);
              if (app) handleTabChange(app);
            }}
            orientation="vertical"
            variant="scrollable"
            sx={{
              mt: 1,
              "& .MuiTabs-indicator": {
                left: 0,
                width: 4,
                backgroundColor: "primary.main",
              },
            }}
          >
            {apps.map((app) => (
              <Tab
                key={app.id}
                label={app.label}
                value={app.id}
                icon={app.icon}
                iconPosition="start"
                sx={{
                  justifyContent: "flex-start",
                  px: 2,
                  py: 1.5,
                  textAlign: "left",
                  minHeight: "auto",
                  color: getActiveTab() === app.id ? "primary.main" : "text.secondary",
                  backgroundColor: getActiveTab() === app.id ? "rgba(25, 103, 210, 0.08)" : "transparent",
                  borderRadius: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(25, 103, 210, 0.12)",
                  },
                  "& .MuiTab-iconWrapper": {
                    marginRight: 1,
                    marginBottom: 0,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Logout Button */}
        <Divider sx={{ mb: 1 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{ 
                color: "error.main",
                m: 1,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                }
              }}
            >
              <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          minHeight: "100vh",
          backgroundColor: "#fafafa",
        }}
      >
        {/* React Router v7 Outlet renders the child routes here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
