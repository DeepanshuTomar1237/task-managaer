import { useCallback, useState } from "react";
import { toast } from "react-toastify";  // Importing toast for displaying notifications
import api from "../api";  // Importing the api instance for making HTTP requests

const useFetch = () => {

  // Local state to handle loading, response data, success message, and error message
  const [state, setState] = useState({
    loading: false,  // Whether the request is loading
    data: null,  // Stores the response data from the API
    successMsg: "",  // Stores success message to be displayed in toast
    errorMsg: "",  // Stores error message to be displayed in toast
  });

  // useCallback hook ensures that the fetchData function doesn't get recreated on every render
  const fetchData = useCallback(async (config, otherOptions) => {
    const { showSuccessToast = true, showErrorToast = true } = otherOptions || {};  // Default to showing toasts for success and error

    // Set loading state to true when the request starts
    setState(state => ({ ...state, loading: true }));

    try {
      // Make the API request using the provided config (endpoint, method, etc.)
      const { data } = await api.request(config);
      
      // Update state with the fetched data, success message and reset error message
      setState({
        loading: false,  // Set loading to false once the request is completed
        data,  // Store the fetched data in state
        successMsg: data.msg || "success",  // If the response has a message, use it; else default to "success"
        errorMsg: ""  // Clear any error message on success
      });

      // Optionally show a success toast notification
      if (showSuccessToast) toast.success(data.msg);
      
      // Resolve the promise with the fetched data
      return Promise.resolve(data);
    }
    catch (error) {
      // If the request fails, extract error message from response or use default message
      const msg = error.response?.data?.msg || error.message || "error";

      // Update state to reflect error, clearing data and setting the error message
      setState({
        loading: false,  // Set loading to false when the request fails
        data: null,  // Clear any data on error
        errorMsg: msg,  // Set the error message from response or default
        successMsg: ""  // Clear any success message on error
      });

      // Optionally show an error toast notification
      if (showErrorToast) toast.error(msg);

      // Reject the promise since the request failed
      return Promise.reject();
    }
  }, []);

  // Return the fetchData function and the current state (loading, data, successMsg, errorMsg)
  return [fetchData, state];
}

export default useFetch;
