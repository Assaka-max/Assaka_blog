import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:3000",
  timeout: 10000,
});

http.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code == 200) {
      return res.data;
    }else{
      console.error(res.message);
      return Promise.reject(res);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
)