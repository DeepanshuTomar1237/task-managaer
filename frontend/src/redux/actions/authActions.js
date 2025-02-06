import api from "../../api" 
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "./actionTypes"
import { toast } from "react-toastify"; 


export const postLoginData = (email, password) => async (dispatch) => {
  try {
    // Dispatching the LOGIN_REQUEST action to indicate the start of the login process
    dispatch({ type: LOGIN_REQUEST });
    
    
    const { data } = await api.post('/auth/login', { email, password });

    // Dispatching LOGIN_SUCCESS action with the response data on successful login
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data, 
    });
    
    
    localStorage.setItem('token', data.token);

    toast.success(data.msg);
  }
  catch (error) {
    const msg = error.response?.data?.msg || error.message;

    dispatch({
      type: LOGIN_FAILURE,
      payload: { msg } 
    });
    toast.error(msg);
  }
}

// Action creator for saving the user profile
export const saveProfile = (token) => async (dispatch) => {
  try {
 
    const { data } = await api.get('/profile', {
      headers: { Authorization: token } 
    });

    // Dispatching SAVE_PROFILE action to store user data and token in the state
    dispatch({
      type: SAVE_PROFILE,
      payload: { user: data.user, token },
    });
  }
  catch (error) {
  }
}

export const logout = () => (dispatch) => {
  
  localStorage.removeItem('token');

 
  dispatch({ type: LOGOUT });

  document.location.href = '/';
}
