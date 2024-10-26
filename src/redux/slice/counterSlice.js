import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {fetchInitialCount} from '../../api/apiRequests';

export const fetchInitialCountAsync = createAsyncThunk(
  'counter/fetchInitialCount',
  async () => {
    const response = await fetchInitialCount();
    
    return response;
  }
);

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    counters: [],
  },
  reducers: {
    initCounter: (state, action) => {
      state.counters.push({
        id: state.counters.length + 1,
        count: action.payload,
      });
    },
    increment: (state, action) => {
      const counter = state.counters.find(c => c.id === action.payload);

      if (counter) {
        counter.count += 1;
      }
    },
    decrement: (state, action) => {
      const counter = state.counters.find(c => c.id === action.payload);

      if (counter) {
        counter.count -= 1;
      }
    },
    randomize: (state, action) => {
      const counter = state.counters.find(c => c.id === action.payload);
      
      if (counter) {
        counter.count = Math.floor(Math.random() * 100);
      }
    },
    addCounter: (state, action) => {
      state.counters.push({
        id: state.counters.length + 1,
        count: action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialCountAsync.fulfilled, (state, action) => {
      state.counters.push({
        id: state.counters.length + 1,
        count: action.payload,
      });
    });
  },
});

export const selectCounters = (state) => state.counter.counters;

export const { initCounter, increment, decrement, randomize, addCounter } = counterSlice.actions;
export default counterSlice.reducer;
