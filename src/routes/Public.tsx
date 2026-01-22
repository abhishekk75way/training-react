import { type RouteObject, redirect } from "react-router-dom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import { store } from "@/store";
import NotFoundPage from "@/pages/not-found";
import SignupPage from "@/pages/signup";
import ForgotPasswordPage from "@/pages/forgot-password";
import AboutPage from "@/pages/about";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    loader: () => {
      const token = store.getState().auth.token;
      if (token) {
        throw redirect("/audio");
      }
      return null;
    },
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage/>
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "/about",
    element: <AboutPage/>
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
];

export default publicRoutes;
