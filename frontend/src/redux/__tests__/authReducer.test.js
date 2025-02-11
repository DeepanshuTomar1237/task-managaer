import authReducer from '../authReducer'; // Import the reducer
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, SAVE_PROFILE } from '../../actions/actionTypes'; // Action Types

describe('authReducer', () => {
  const initialState = {
    loading: false,
    user: {},
    isLoggedIn: false,
    token: "",
    successMsg: "",
    errorMsg: "",
  };

  it('should return the initial state when no action is passed', () => {
    const newState = authReducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('should handle LOGIN_REQUEST action', () => {
    const action = { type: LOGIN_REQUEST };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      loading: true,
      user: {},
      isLoggedIn: false,
      token: "",
      successMsg: "",
      errorMsg: "",
    });
  });

  it('should handle LOGIN_SUCCESS action', () => {
    const action = {
      type: LOGIN_SUCCESS,
      payload: {
        user: { name: 'John Doe' },
        token: 'mockToken',
        msg: 'Login successful',
      },
    };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      loading: false,
      user: { name: 'John Doe' },
      isLoggedIn: true,
      token: 'mockToken',
      successMsg: 'Login successful',
      errorMsg: '',
    });
  });

  it('should handle LOGIN_FAILURE action', () => {
    const action = {
      type: LOGIN_FAILURE,
      payload: { msg: 'Invalid credentials' },
    };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      loading: false,
      user: {},
      isLoggedIn: false,
      token: "",
      successMsg: "",
      errorMsg: 'Invalid credentials',
    });
  });

  it('should handle LOGOUT action', () => {
    const action = { type: LOGOUT };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      loading: false,
      user: {},
      isLoggedIn: false,
      token: "",
      successMsg: "",
      errorMsg: "",
    });
  });

  it('should handle SAVE_PROFILE action', () => {
    const action = {
      type: SAVE_PROFILE,
      payload: { user: { name: 'Jane Doe' }, token: 'newToken' },
    };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      loading: false,
      user: { name: 'Jane Doe' },
      isLoggedIn: true,
      token: 'newToken',
      successMsg: "",
      errorMsg: "",
    });
  });
});
