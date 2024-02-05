import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = window.Configs.urlApi;

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/users/register`, {
        mobile: mobile,
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async ({ otpId, otpCode, mobile }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/users/verify`, {
        otpId: otpId,
        otpCode: otpCode,
        mobile: mobile,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    loadingRegister: false,
    loadingVerifyOTP: false,
    userData: null,
    otpId: null,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loadingRegister = true;
      state.error = null;
    });
  
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loadingRegister = false;
      state.userData = action.payload;
      state.otpId = action.payload?.data?.otpId || null;
    });
    
  
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loadingRegister = false;
      state.error = action.payload?.message || 'Registration failed'; 
    });
  
    builder.addCase(verifyOTP.pending, (state) => {
      state.loadingVerifyOTP = true;
      state.error = null;
    });
  
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.loadingVerifyOTP = false;
      state.userData = action.payload;
    });
  
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.loadingVerifyOTP = false;
      state.error = action.payload?.message || 'OTP verification failed'; 
    });
  },
});

export default userSlice.reducer;
