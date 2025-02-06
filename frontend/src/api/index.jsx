import axios from "axios";

// Creating an axios instance with a predefined base URL for API requests
const api = axios.create({
  // The base URL for the API, so individual requests don't need to include the full URL
  baseURL: "/api",
});

export default api;
