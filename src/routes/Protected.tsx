import type { RouteObject } from "react-router-dom";
import AudioPage from "@/pages/audio";
import { authLoader } from "@/services/authLoader";
import AuthLayout from "@/layouts/authLayout";
import AdminLayout from "@/layouts/adminLayout";
import AudioTrimPage from "@/pages/audio-trim";
import AdminPage from "@/pages/admin";
import { adminLoader } from "@/services/adminLoader";
import DashboardPage from "@/pages/dashboard";

const protectedRoutes: RouteObject[] = [
  // User Protected Routes with Static Sidebar (App-based tabs)
  {
    element: <AuthLayout />,
    loader: authLoader,
    children: [
      // Dashboard (Global/Home)
      {
        path: "/dashboard",
        element: <DashboardPage />
      },
      // Audio App (contains Audio Trim and Audio)
      {
        path: "/audio-app",
        element: <AudioPage />
      },
      {
        path: "/audio",
        element: <AudioPage />
      },
      {
        path: "/audio-trim",
        element: <AudioTrimPage />
      },
    ]
  },
  // Admin Routes with Admin Layout
  {
    element: <AdminLayout />,
    loader: adminLoader,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      }
    ]
  }
];

export default protectedRoutes;
