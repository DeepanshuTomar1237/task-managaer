import { useCallback, useState } from "react";
import { toast } from "react-toastify";  
import api from "../api";  

const useFetch = () => {

  // Local state to handle loading, response data, success message, and error message
  const [state, setState] = useState({
    loading: false,  
    data: null,  
    successMsg: "", 
    errorMsg: "",  
  });

  // 1useCallback hook ensures that the fetchData function doesn't get recreated on every render
  const fetchData = useCallback(async (config, otherOptions) => {
    const { showSuccessToast = true, showErrorToast = true } = otherOptions || {};  // Default to showing toasts for success and error

    
    setState(state => ({ ...state, loading: true }));

    try {
      // Make the API request using the provided config (endpoint, method, etc.)
      const { data } = await api.request(config);
      
      // Update state with the fetched data, success message and reset error message
      setState({
        loading: false,  
        data,  
        successMsg: data.msg || "success",  
        errorMsg: "" 
      });

      
      if (showSuccessToast) toast.success(data.msg);
      
      
      return Promise.resolve(data);
    }
    catch (error) {
      // If the request fails, extract error message from response or use default message
      const msg = error.response?.data?.msg || error.message || "error";

      // Update state to reflect error, clearing data and setting the error message
      setState({
        loading: false,  
        data: null,  
        errorMsg: msg,  
        successMsg: ""  
      });

      n
      if (showErrorToast) toast.error(msg);

     
      return Promise.reject();
    }
  }, []);

  return [fetchData, state];
}

export default useFetch;
