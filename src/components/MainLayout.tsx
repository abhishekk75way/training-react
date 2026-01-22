import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Divider, useTheme
} from "@mui/material";
import {
  Home as HomeIcon,
  ContentCut as ContentCutIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  // Define your navigation links here
  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { text: "Audio Trim", icon: <ContentCutIcon />, path: "/audio" },
  ];

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
            backgroundColor: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            App Studio
          </Typography>
        </Toolbar>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 1 }}>
          <List sx={{ gap: 0.5, display: "flex", flexDirection: "column" }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    border: location.pathname === item.path 
                      ? `1px solid ${theme.palette.primary.main}`
                      : `1px solid transparent`,
                    backgroundColor: location.pathname === item.path 
                      ? theme.palette.action.selected
                      : "transparent",
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? "primary.main" : "inherit",
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: location.pathname === item.path ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
          
          <List sx={{ mt: "auto" }}>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  color: theme.palette.error.main,
                  border: `1px solid transparent`,
                  "&:hover": {
                    backgroundColor: theme.palette.error.light,
                    borderColor: theme.palette.error.main,
                  },
                }}
              >
                <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
}