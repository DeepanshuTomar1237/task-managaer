import { postLoginData, saveProfile, logout } from '../authActions'; // Importing actions
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SAVE_PROFILE } from '../actionTypes'; // Action Types
import api from '../../../api'; // API
import { toast } from 'react-toastify';

// Mocking the API
jest.mock('../../../api');
jest.mock('react-toastify');

describe('authActions', () => {
  let dispatch;
  
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should dispatch LOGIN_REQUEST and LOGIN_SUCCESS for successful login', async () => {
    const mockData = { token: 'mockToken', msg: 'Login successful' };
    
    // Mock the API response
    api.post.mockResolvedValue({ data: mockData });

    await postLoginData('email@example.com', 'password')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: LOGIN_REQUEST });
    expect(dispatch).toHaveBeenCalledWith({
      type: LOGIN_SUCCESS,
      payload: mockData,
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
    expect(toast.success).toHaveBeenCalledWith(mockData.msg);
  });

  it('should dispatch LOGIN_FAILURE for failed login', async () => {
    const errorMsg = 'Invalid credentials';
    
    // Mock the API to reject the promise
    api.post.mockRejectedValue({ response: { data: { msg: errorMsg } } });

    await postLoginData('wrongemail@example.com', 'wrongpassword')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: LOGIN_REQUEST });
    expect(dispatch).toHaveBeenCalledWith({
      type: LOGIN_FAILURE,
      payload: { msg: errorMsg },
    });
    expect(toast.error).toHaveBeenCalledWith(errorMsg);
  });

  it('should dispatch SAVE_PROFILE action for successful profile fetch', async () => {
    const mockToken = 'mockToken';
    const mockUser = { user: 'user' };
    
    // Mock the API response
    api.get.mockResolvedValue({ data: mockUser });

    await saveProfile(mockToken)(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: SAVE_PROFILE,
      payload: { user: mockUser.user, token: mockToken },
    });
  });

  it('should dispatch LOGOUT action and remove token from localStorage', () => {
    logout()(dispatch);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(dispatch).toHaveBeenCalledWith({ type: LOGOUT });
    expect(document.location.href).toBe('/');
  });
});
