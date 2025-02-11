import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from 'redux-mock-store';
import Home from '../Home'; // Adjust the import path as needed
import '@testing-library/jest-dom';

// Mock store
const mockStore = configureStore([]);

describe('Home Component', () => {
  let store;

  beforeEach(() => {
    // Initial store setup for logged-in state
    store = mockStore({
      authReducer: {
        isLoggedIn: true,
        user: { name: 'John Doe' },
        token: 'mockToken',
      },
    });
  });

  it('renders welcome message when user is logged in', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    // Check if the welcome message with the user name is rendered
    expect(screen.getByText('Welcome John Doe')).toBeInTheDocument();
    expect(screen.getByText('Welcome John Doe').tagName).toBe('H1');

    // Check if the Tasks component is rendered
    expect(screen.getByTestId('tasks-container')).toBeInTheDocument();
  });

  it('renders signup prompt when user is not logged in', () => {
    // Update the store for the logged-out state
    store = mockStore({
      authReducer: {
        isLoggedIn: false,
        user: null,
        token: '',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    // Check if the signup message is rendered
    expect(screen.getByText('Welcome to Task Manager App')).toBeInTheDocument();
    expect(screen.getByText('Join now to manage your tasks')).toBeInTheDocument();
    expect(screen.getByText('Join now to manage your tasks').tagName).toBe('SPAN');
  });

  it('updates document title when user logs in', () => {
    // Initial document title before rendering
    document.title = 'Task Manager';

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    // Assert that the document title includes the user's name when logged in
    expect(document.title).toBe("John Doe's tasks");
  });

  it('redirects to signup page when user is not logged in and clicks join now link', async () => {
    // Update the store for the logged-out state
    store = mockStore({
      authReducer: {
        isLoggedIn: false,
        user: null,
        token: '',
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );

    // Check if the signup link exists and simulate a click
    const signupLink = screen.getByText('Join now to manage your tasks');
    fireEvent.click(signupLink);

    // Check if the URL includes "/signup" (assuming routing is working correctly)
    await waitFor(() => expect(window.location.pathname).toBe('/signup'));
  });
});
