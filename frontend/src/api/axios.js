import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-q5i8.onrender.com/api",
  withCredentials: true, // IMPORTANT for cookies
});

export default api;
