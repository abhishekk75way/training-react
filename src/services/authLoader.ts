import { redirect } from "react-router-dom";
import { decodeToken } from "./jwt";

export async function authLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/login");
  }

  try {
    const payload = decodeToken(token);
    // Store user data from token in localStorage for Redux
    localStorage.setItem("user", JSON.stringify(payload));
    return payload;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw redirect("/login");
  }
}
