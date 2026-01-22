import { redirect } from "react-router-dom";
import { decodeToken } from "./jwt";

export async function adminLoader() {
  const token = localStorage.getItem("token")

  if (!token) {
    throw redirect("/login");
  }

  const payload = decodeToken(token);

  if (payload.role !== "admin") {
    throw redirect("/audio"); 
  }

  return payload;
}
