import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Counter from '../components/Counter';
import counterReducer from '../redux/slice/counterSlice';
import { fetchInitialCount } from '../api/apiRequests';

jest.mock('../api/apiRequests', () => ({
  fetchInitialCount: jest.fn(),
}));

const render = (component, { store }) => rtlRender(
  <Provider store={store}>{component}</Provider>
);

describe('Counter Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        counter: counterReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Stage A
  test('renders the counter with initial predefined value', async () => {
    render(<Counter predefinedValue={2} />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 2/i)).toBeInTheDocument();
    });
  });

  test('increments the counter when Increment button is clicked with predefined value', async () => {
    render(<Counter predefinedValue={4} />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 4/i)).toBeInTheDocument();
    });

    const incrementButton = screen.getByText(/Increment/i);
    fireEvent.click(incrementButton);

    expect(screen.getByText(/Counter 1: 5/i)).toBeInTheDocument();
  });

  test('decrements the counter when Decrement button is clicked with predefined value', async () => {
    render(<Counter predefinedValue={6} />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 6/i)).toBeInTheDocument();
    });

    const decrementButton = screen.getByText(/Decrement/i);
    fireEvent.click(decrementButton);

    expect(screen.getByText(/Counter 1: 5/i)).toBeInTheDocument();
  });

  // Stage B
  test('renders the counter with initial value from mocked backend API', async () => {
    fetchInitialCount.mockResolvedValueOnce(5);

    render(<Counter />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 5/i)).toBeInTheDocument();
    });
  });

  test('increments the counter when Increment button is clicked with mocked backend API', async () => {
    fetchInitialCount.mockResolvedValueOnce(8);

    render(<Counter />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 8/i)).toBeInTheDocument();
    });

    const incrementButton = screen.getByText(/Increment/i);
    fireEvent.click(incrementButton);

    expect(screen.getByText(/Counter 1: 9/i)).toBeInTheDocument();
  });

  test('decrements the counter when Decrement button is clicked with mocked backend API', async () => {
    fetchInitialCount.mockResolvedValueOnce(11);

    render(<Counter />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 11/i)).toBeInTheDocument();
    });

    const decrementButton = screen.getByText(/Decrement/i);
    fireEvent.click(decrementButton);

    expect(screen.getByText(/Counter 1: 10/i)).toBeInTheDocument();
  });


  // Stage C
  test('randomizes the counter when Randomize button is clicked with predefined value', async () => {
    const initialValue = 5;
    const mockRandomValue = 8;
  
    fetchInitialCount.mockResolvedValueOnce(mockRandomValue);
    
    render(<Counter predefinedValue={initialValue} />, { store });
  
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`Counter 1: ${initialValue}`, 'i'))).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText(/Randomize/i));
  
    await waitFor(() => {
      const countValue = screen.getByText(/Counter 1:/i).textContent;
      const count = parseInt(countValue.split(': ')[1], 10);
      
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThan(100);
    });
  });

  test('randomizes the counter when Randomize button is clicked with mocked backend API', async () => {
    const mockRandomValue = 11;
  
    fetchInitialCount.mockResolvedValueOnce(mockRandomValue);
    
    render(<Counter />, { store });
  
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`Counter 1: ${mockRandomValue}`, 'i'))).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText(/Randomize/i));
  
    await waitFor(() => {
      const countValue = screen.getByText(/Counter 1:/i).textContent;
      const count = parseInt(countValue.split(': ')[1], 10);
      
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThan(100);
    });
  });


  // Stage D
  test('adds a new counter with the same functionality with predefined value', async () => {
    fetchInitialCount.mockResolvedValueOnce(6);
    render(<Counter predefinedValue={2} />, { store });
  
    const addCounterButton = await screen.findByText(/Add Counter/i);
    
    fireEvent.click(addCounterButton);
  
    await waitFor(() => {
      expect(screen.getByText(/Counter 2: 2/i)).toBeInTheDocument();
    });
  });  

  test('adds a new counter with the same functionality with mocked backend API', async () => {
    fetchInitialCount.mockResolvedValueOnce(10);

    render(<Counter />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Counter 1: 10/i)).toBeInTheDocument();
    });

    fetchInitialCount.mockResolvedValueOnce(6);

    const addCounterButton = screen.getByText(/Add Counter/i);
    
    fireEvent.click(addCounterButton);

    await waitFor(() => {
      expect(screen.getByText(/Counter 2: 6/i)).toBeInTheDocument();
    });
  });
});
