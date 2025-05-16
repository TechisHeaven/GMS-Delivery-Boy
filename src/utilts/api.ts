import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_MAIN_URL}`,
});

export default api;
