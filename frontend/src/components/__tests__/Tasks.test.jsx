import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Tasks from '../Tasks'; // Adjust the import path if necessary
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import useFetch from '../../hooks/useFetch';

// Mock hooks
jest.mock('../../hooks/useFetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Redux store
const mockStore = configureStore([]);
const store = mockStore({ authReducer: { isLoggedIn: true, token: 'mockToken' } });

describe('Tasks Component', () => {
  it('renders the loader when loading tasks', async () => {
    // Mock loading state
    useFetch.mockReturnValue([jest.fn(), { loading: true }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    // Assert loader is rendered
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders tasks correctly when fetched', async () => {
    const mockTasks = [{ _id: '1', description: 'Task 1' }];
    
    // Mock successful fetch
    const fetchDataMock = jest.fn();
    useFetch.mockReturnValue([fetchDataMock, { loading: false, tasks: mockTasks }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    // Wait for tasks to be rendered
    await waitFor(() => screen.getByText('Task #1'));

    // Assert that Task #1 is rendered
    expect(screen.getByText('Task #1')).toBeInTheDocument();
  });

  it('shows no tasks message when there are no tasks', async () => {
    // Mock empty task list
    const fetchDataMock = jest.fn();
    useFetch.mockReturnValue([fetchDataMock, { loading: false, tasks: [] }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    // Assert the "No tasks found" message is displayed
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('deletes a task', async () => {
    const mockTasks = [{ _id: '1', description: 'Task 1' }];
    
    // Mock fetch with tasks
    const fetchDataMock = jest.fn();
    useFetch.mockReturnValue([fetchDataMock, { loading: false, tasks: mockTasks }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-task-1');
    
    // Wrap the state update in act()
    act(() => {
      fireEvent.click(deleteButton);
    });

    // Mock the fetch again to reflect the deletion (empty task list)
    useFetch.mockReturnValue([fetchDataMock, { loading: false, tasks: [] }]);

    // Wait for tasks to be deleted and "No tasks found" message to appear
    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
  });

  it('displays no tasks message if all tasks are deleted', async () => {
    // Mock empty task list after deletion
    const fetchDataMock = jest.fn();
    useFetch.mockReturnValue([fetchDataMock, { loading: false, tasks: [] }]);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    // Assert the "No tasks found" message is displayed
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });
});
