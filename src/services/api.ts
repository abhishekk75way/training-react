import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

interface AuthData {
    email: string;
    password: string;
}

export const login = (data: AuthData) =>
  api.post<{ token: string }>("/login", data);

export const signup = (data: AuthData) =>
  api.post("/register", data);

export const forgotPassword = (data: { email: string }) =>
  api.post("/forgot-password", data);

export interface Job {
  ID: string;
  Status: "queued" | "processing" | "completed" | "failed";
  ZipPath?: string | null;
  Files?: {
    OutputPath?: string | null;
    Status: string;
  }[];
}

export const convertAudio = (data: FormData) =>
  api.post<{ job_id: string }>("/auth/convert", data);

export const getJobStatus = (jobId: string) => {
  return api.get<Job>(`/auth/jobs/${jobId}`);
};

export const getAllJobs = () => {
  return api.get<Job[]>("/auth/jobs");
};

export const downloadResult = (jobId: string) => {
  return api.get(`/auth/download/${jobId}`, {
    responseType: "blob",
  });
};

export const getProfile = () =>
  api.get("/auth/profile");