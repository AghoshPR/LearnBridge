import axios from "axios";
import { toast } from "sonner";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

Api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (
      auth?.isAuthenticated &&   
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh/")
    ) {
      originalRequest._retry = true;

      try {
        await Api.post("/auth/refresh/");
        return Api(originalRequest);
      } catch (err) {

        localStorage.removeItem("auth");

        toast.error("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default Api;