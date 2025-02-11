import { renderHook, act } from '@testing-library/react-hooks';
import useFetch from '../useFetch';

// Mock the api.request method to return a fake response
jest.mock('../api', () => ({
  request: jest.fn(),
}));

describe('useFetch Hook', () => {
  it('should fetch data successfully', async () => {
    const mockData = { msg: 'Success', tasks: [] };
    
    // Mock API response
    api.request.mockResolvedValue({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() => useFetch());

    // Call the fetchData function
    act(() => {
      result.current[0]({ url: '/tasks', method: 'get' });
    });

    // Wait for the state update to complete
    await waitForNextUpdate();

    // Check that the hook has set the correct state
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].data).toEqual(mockData);
    expect(result.current[1].errorMsg).toBe('');
  });

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error';
    
    // Mock API response error
    api.request.mockRejectedValue({ response: { data: { msg: errorMessage } } });

    const { result, waitForNextUpdate } = renderHook(() => useFetch());

    // Call the fetchData function
    act(() => {
      result.current[0]({ url: '/tasks', method: 'get' });
    });

    // Wait for the state update to complete
    await waitForNextUpdate();

    // Check that the hook has set the correct error state
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].errorMsg).toBe(errorMessage);
    expect(result.current[1].data).toBeNull();
  });
});

