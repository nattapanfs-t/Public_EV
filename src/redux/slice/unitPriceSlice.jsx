import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const URL = window.Configs.urlApi;

const initialState = {
  loading: "idle",
  error: null,
  unitPricesData: null,
};

export const fetchUnitPrices = createAsyncThunk(
  "unitPrices/fetchUnitPrices",
  async (chargerId) => {
    try {
      const response = await axios.get(`${URL}/unitPrices/${chargerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const unitPricesSlice = createSlice({
  name: "unitPrices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitPrices.pending, (state) => {
        state.loading = "true";
      })
      .addCase(fetchUnitPrices.fulfilled, (state, action) => {
        state.loading = "false";
        state.unitPricesData = action.payload.data;
      })
      .addCase(fetchUnitPrices.rejected, (state, action) => {
        state.loading = "false";
        state.error = action.error.message;
      });
  },
});

export default unitPricesSlice.reducer;
