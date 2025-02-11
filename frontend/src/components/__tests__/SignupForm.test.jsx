import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from '../../components/SignupForm';
import useFetch from '../../hooks/useFetch';
import { validateManyFields } from '../../validations';

// Mock dependencies
jest.mock('../../hooks/useFetch');
jest.mock('../../validations', () => ({
  validateManyFields: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignupForm', () => {
  let mockFetchData;

  beforeEach(() => {
    mockFetchData = jest.fn();
    useFetch.mockReturnValue([mockFetchData, { loading: false }]);
    validateManyFields.mockReturnValue([]); // Mock validation function
  });

  test('renders the form correctly', () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('updates input values correctly', () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('securePass123');
  });

  test('shows validation errors when fields are empty', async () => {
    validateManyFields.mockReturnValue([
      { field: 'name', err: 'Name is required' },
      { field: 'email', err: 'Email is required' },
      { field: 'password', err: 'Password is required' },
    ]);

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
    });
  });

  test('submits the form successfully and navigates to login', async () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass123' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledWith({
        url: '/auth/signup',
        method: 'post',
        data: { name: 'John Doe', email: 'john@example.com', password: 'securePass123' },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays loader when submitting', async () => {
    useFetch.mockReturnValue([mockFetchData, { loading: true }]);

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
