import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "../actions/actionTypes"; 

const initialState = {
  loading: false,
  user: {},
  isLoggedIn: false,
  token: "", 
  successMsg: "", 
  errorMsg: "",
};

// The authReducer function handles actions related to user authentication
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    
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
        user: action.payload.user, 
        isLoggedIn: true, 
        token: action.payload.token, 
        successMsg: action.payload.msg, 
        errorMsg: "", 
      };

    // Case when login fails
    case LOGIN_FAILURE:
      return { 
        loading: false, 
        user: {}, 
        isLoggedIn: false, 
        token: "", 
        successMsg: "", 
        errorMsg: action.payload.msg, 
      };

    // Case when the user logs out
    case LOGOUT:
      return { 
        loading: false, 
        user: {}, 
        isLoggedIn: false,
        token: "", 
        successMsg: "", 
        errorMsg: "", 
      };

    // Case when the profile is successfully saved after login
    case SAVE_PROFILE:
      return { 
        loading: false, 
        user: action.payload.user, 
        isLoggedIn: true, 
        token: action.payload.token, 
        successMsg: "", 
        errorMsg: "", 
      };

    default:
      return state;
  }
};

export default authReducer;
