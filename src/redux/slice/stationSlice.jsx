import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = window.Configs.urlApi;

const initialState = {
  stationData: null,
  loading: false,
  error: null,
  chargerId : null,
};

export const fetchStationDetails = createAsyncThunk(
  'station/fetchStationDetails',
  async (chargerPointId) => {
    try {
      const response = await fetch(`${URL}/station/${chargerPointId}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  }
);

const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.stationData = action.payload;
        const chargerId = action.payload?.chargerPoint?.chargerId;
        if (chargerId) {
          localStorage.setItem('chargerId', chargerId);
        }
      })
      .addCase(fetchStationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectChargerId = (state) => state.station?.stationData?.chargerPoint?.chargerId;
export default stationSlice.reducer;
