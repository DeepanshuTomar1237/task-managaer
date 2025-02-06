import api from "../../api" // Importing the API instance for making HTTP requests
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "./actionTypes" // Importing action types for different auth actions
import { toast } from "react-toastify"; // Importing toast for displaying success and error notifications

// Action creator for logging in a user
export const postLoginData = (email, password) => async (dispatch) => {
  try {
    // Dispatching the LOGIN_REQUEST action to indicate the start of the login process
    dispatch({ type: LOGIN_REQUEST });
    
    // Making a POST request to the API for user login
    const { data } = await api.post('/auth/login', { email, password });

    // Dispatching LOGIN_SUCCESS action with the response data on successful login
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data, // The response data contains the user's token and other info
    });
    
    // Saving the token to localStorage to persist the login state
    localStorage.setItem('token', data.token);

    // Displaying a success notification to the user
    toast.success(data.msg);
  }
  catch (error) {
    // Extracting the error message from the response or fallback to a generic message
    const msg = error.response?.data?.msg || error.message;

    // Dispatching LOGIN_FAILURE action with the error message
    dispatch({
      type: LOGIN_FAILURE,
      payload: { msg } // Error message for handling in the reducer
    });

    // Displaying an error notification to the user
    toast.error(msg);
  }
}

// Action creator for saving the user profile
export const saveProfile = (token) => async (dispatch) => {
  try {
    // Making a GET request to fetch the user profile using the provided token
    const { data } = await api.get('/profile', {
      headers: { Authorization: token } // Passing the token in the Authorization header
    });

    // Dispatching SAVE_PROFILE action to store user data and token in the state
    dispatch({
      type: SAVE_PROFILE,
      payload: { user: data.user, token }, // Saving user info and token to Redux store
    });
  }
  catch (error) {
    // Handling any errors from the profile fetch (no specific action for error)
    // console.log(error); // You can log the error for debugging, but it's currently commented out
  }
}

// Action creator for logging out the user
export const logout = () => (dispatch) => {
  // Removing the token from localStorage to clear the user's session
  localStorage.removeItem('token');

  // Dispatching the LOGOUT action to update the Redux state
  dispatch({ type: LOGOUT });

  // Redirecting the user to the home page or login page after logout
  document.location.href = '/';
}
