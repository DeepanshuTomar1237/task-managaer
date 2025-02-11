import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Task from '../Task'; // Path to your Task component
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import useFetch from '../../hooks/useFetch';

// Mocking the useFetch hook
jest.mock('../../hooks/useFetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mocking useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock Redux store
const mockStore = configureStore([]);
const store = mockStore({
  authReducer: {
    isLoggedIn: true,
    token: 'mockToken',
  },
});

describe('Task Page', () => {
  it('renders the Add task form correctly', async () => {
    useFetch.mockReturnValue([jest.fn(), { loading: false }]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      </Provider>
    );

    // Assert that the form is rendered correctly
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Add task')).toBeInTheDocument();
  });

  it('handles form submission for adding a task', async () => {
    useFetch.mockReturnValue([jest.fn(), { loading: false }]);

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      </Provider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Task' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Add task'));

    // Wait for the navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays validation errors when the form is invalid', async () => {
    useFetch.mockReturnValue([jest.fn(), { loading: false }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      </Provider>
    );

    // Submit the form without filling in any fields
    fireEvent.click(screen.getByText('Add task'));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('renders the Update task form and handles update', async () => {
    useFetch.mockReturnValue([jest.fn(), { loading: false, task: { description: 'Existing Task' } }]);

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ taskId: '123' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      </Provider>
    );

    // Check if the form loads with existing task description
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByText('Edit Task')).toBeInTheDocument();

    // Submit the form after editing
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Updated Task' },
    });

    fireEvent.click(screen.getByText('Update Task'));

    // Assert navigation after update
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('resets the form when Reset button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ taskId: '123' });

    useFetch.mockReturnValue([jest.fn(), { loading: false, task: { description: 'Existing Task' } }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      </Provider>
    );

    // Click the Reset button
    fireEvent.click(screen.getByText('Reset'));

    // Assert that the description field has been reset to the original task description
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
  });
});
