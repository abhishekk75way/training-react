import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Divider, Tabs, Tab,
  Menu, MenuItem, Avatar, Stack, IconButton, useTheme
} from "@mui/material";
import {
  Home as HomeIcon,
  ContentCut as ContentCutIcon,
  Settings as AdminIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { logout } from "@/store/authSlice";
import UploadStatusIndicator from "@/components/UploadStatusIndicator";
import { useState } from "react";

const drawerWidth = 240;

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state: any) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login", { replace: true });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    handleLogout();
  };

  // Apps structure
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

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname === "/dashboard") return "dashboard";
    if (location.pathname.startsWith("/audio")) return "audio-app";
    if (location.pathname.startsWith("/admin")) return "admin";
    return "dashboard";
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
      </Drawer>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#fafafa",
        }}
      >
        {/* Top Bar with Profile - Sticky */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: "transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {user?.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box sx={{ textAlign: "left", display: { xs: "none", sm: "flex" }, flexDirection: "column", gap: 0.25 }}>
              <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1 }}>
                {user?.email?.split("@")[0] || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          </IconButton>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                minWidth: 240,
                mt: 1,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {/* Profile Info Section */}
            <MenuItem disabled sx={{ py: 1.5, px: 2 }}>
              <Stack spacing={0.5} sx={{ width: "100%" }}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.email?.split("@")[0] || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || "user@example.com"}
                </Typography>
              </Stack>
            </MenuItem>

            <Divider />

            {/* Logout Option */}
            <MenuItem
              onClick={handleLogoutClick}
              sx={{
                color: "error.main",
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          {/* React Router v7 Outlet renders the child routes here */}
          <Outlet />
        </Box>
      </Box>

      {/* Upload Status Indicator - Global */}
      <UploadStatusIndicator />
    </Box>
  );
};

export default AuthLayout;
