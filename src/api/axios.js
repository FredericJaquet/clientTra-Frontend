import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ajusta a tu backend
});

// Interceptor para añadir token en cada request
api.interceptors.request.use((config) => {
  // Endpoints que deben quedar libres de token
  const publicEndpoints = ["/auth/login", "/registration"];

  // Verifica si la URL actual empieza por alguno de los endpoints públicos
  const isPublic = publicEndpoints.some((url) => config.url.startsWith(url));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
