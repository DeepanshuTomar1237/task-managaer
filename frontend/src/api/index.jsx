// Importing axios library for making HTTP requests
import axios from "axios";

// Creating an axios instance with a predefined base URL for API requests
const api = axios.create({
  // The base URL for the API, so individual requests don't need to include the full URL
  baseURL: "/api",
});

// Exporting the axios instance for use in other parts of the application
export default api;
