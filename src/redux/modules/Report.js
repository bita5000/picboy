import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookieToken, getRefreshToken } from '../../shared/Cookie';
import axios from 'axios';

const myToken = getCookieToken();
const refreshToken = getRefreshToken();
const baseURL = process.env.REACT_APP_API_KEY;

export const __postReport = createAsyncThunk(
  'postReport',
  async (postId, thunkAPI) => {
    try {
      const data = await axios.post(`${baseURL}/post/report/${postId}`, '', {
        headers: {
          Authorization: myToken,
          'refresh-token': refreshToken,
        },
      });
      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [__postReport.pending]: (state) => {
      state.isLoading = true;
    },
    [__postReport.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.reports = action.payload;
    },
    [__postReport.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
