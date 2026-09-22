import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:3000",
  timeout: 10000,
});