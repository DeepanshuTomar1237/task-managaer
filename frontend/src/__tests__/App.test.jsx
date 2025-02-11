import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { saveProfile } from '../../redux/actions/authActions';
import userEvent from '@testing-library/user-event';

// Mock Redux store
const mockStore = configureStore([]);
const store = mockStore({
  authReducer: { isLoggedIn: false, token: '' },
});

// Mock the dispatch function and other necessary imports
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../redux/actions/authActions', () => ({
  saveProfile: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(store.getState()));
  });

  it('should render the Home route correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Check if Home component is rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should redirect to login if not logged in and accessing a protected route like /tasks/add', async () => {
    store.getState = jest.fn().mockReturnValue({
      authReducer: { isLoggedIn: false, token: '' },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Simulate a click on the protected route
    userEvent.click(screen.getByText('Add Task'));

    // Assert that it redirects to login
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should redirect to / if the user tries to access /signup when logged in', async () => {
    store.getState = jest.fn().mockReturnValue({
      authReducer: { isLoggedIn: true, token: 'mock-token' },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Assert that it redirects to Home when logged in and accessing /signup
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should route to NotFound page for unknown route', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Simulate an unknown route
    window.history.pushState({}, 'Test page', '/non-existing');

    await waitFor(() => expect(screen.getByText('404')).toBeInTheDocument());
  });

  it('should call saveProfile when token is available in localStorage', async () => {
    const dispatch = jest.fn();

    // Mock localStorage
    global.localStorage.setItem('token', 'mock-token');
    useDispatch.mockReturnValue(dispatch);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Check if the saveProfile function is called
    expect(saveProfile).toHaveBeenCalledWith('mock-token');
  });
});
