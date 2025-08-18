// frontend/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // endereço do backend
});

export default api;
