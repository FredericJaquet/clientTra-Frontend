import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interceptor to add token to each request
api.interceptors.request.use((config) => {
  // Endpoints que deben quedar libres de token
  const publicEndpoints = ["/auth/login", "/registration"];

  // Endpoints that must remain token-free
  const isPublic = publicEndpoints.some((url) => config.url.startsWith(url));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

//export const setupResponseInterceptor = (navigate) => {
export const setupResponseInterceptor = () => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        //navigate("/", { replace: true });
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );
};

export default api;
