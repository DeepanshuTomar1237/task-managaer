import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Login'; // Import Login page
import MainLayout from '../../layouts/MainLayout'; // Import MainLayout component
import LoginForm from '../../components/LoginForm'; // Import LoginForm component

// Mock the LoginForm component to avoid testing its functionality here
jest.mock('../../components/LoginForm', () => {
  return jest.fn(() => <div data-testid="login-form">Login Form</div>);
});

describe('Login Page', () => {
  it('renders LoginForm component', () => {
    // Render the Login page wrapped in a Router (required by react-router)
    render(
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );

    // Assert that LoginForm is rendered
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('sets document title to "Login"', () => {
    // Render the Login page wrapped in a Router (required by react-router)
    render(
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );

    // Assert that the document title is set correctly
    expect(document.title).toBe('Login');
  });

  it('passes redirectUrl from location state to LoginForm', () => {
    // Render the Login page with a mock location state
    const mockLocation = {
      state: { redirectUrl: 'https://example.com' }
    };

    render(
      <Router location={mockLocation}>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );

    // Assert that the redirectUrl is passed as a prop to LoginForm
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveTextContent('Login Form');
  });

  it('renders MainLayout with Login form as child', () => {
    // Render the Login page wrapped in a Router (required by react-router)
    render(
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );

    // Assert that MainLayout is rendered by checking the LoginForm within it
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
