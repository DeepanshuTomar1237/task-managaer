import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "../actions/actionTypes"; // Importing action types for authentication

// Initial state for the auth reducer, which contains default values for user, token, and loading/error states
const initialState = {
  loading: false, // Represents the loading state during login or profile fetch
  user: {}, // Contains user information once logged in
  isLoggedIn: false, // Tracks if the user is logged in or not
  token: "", // The token used for authentication and storing in localStorage
  successMsg: "", // Stores success messages (for example, login success message)
  errorMsg: "", // Stores error messages if any error occurs during authentication
};

// The authReducer function handles actions related to user authentication
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // Case when the login request is initiated
    case LOGIN_REQUEST:
      return { 
        loading: true, 
        user: {}, 
        isLoggedIn: false, 
        token: "", 
        successMsg: "", 
        errorMsg: "", 
      };

    // Case when the login is successful
    case LOGIN_SUCCESS:
      return { 
        loading: false, 
        user: action.payload.user, // User data from the successful login response
        isLoggedIn: true, // User is now logged in
        token: action.payload.token, // Storing the token to authenticate further requests
        successMsg: action.payload.msg, // Success message returned by the server
        errorMsg: "", // No error in this case
      };

    // Case when login fails
    case LOGIN_FAILURE:
      return { 
        loading: false, 
        user: {}, 
        isLoggedIn: false, 
        token: "", 
        successMsg: "", 
        errorMsg: action.payload.msg, // Error message returned from the API or default error
      };

    // Case when the user logs out
    case LOGOUT:
      return { 
        loading: false, 
        user: {}, 
        isLoggedIn: false, // The user is now logged out
        token: "", 
        successMsg: "", 
        errorMsg: "", 
      };

    // Case when the profile is successfully saved after login
    case SAVE_PROFILE:
      return { 
        loading: false, 
        user: action.payload.user, // User data from the profile fetch request
        isLoggedIn: true, // User is logged in after saving the profile
        token: action.payload.token, // Storing the token
        successMsg: "", 
        errorMsg: "", 
      };

    // Default case to return the current state if no recognized action is found
    default:
      return state;
  }
};

export default authReducer;
