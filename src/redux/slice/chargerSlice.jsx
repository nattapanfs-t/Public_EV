import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = window.Configs.urlApi;

export const fetchChargerDetails = createAsyncThunk(
  "charger/fetchChargerDetails",
  async (chargerPointId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/chargers/detail/${chargerPointId}`, {
        headers: {
          "x-api-key": localStorage.getItem("identityKey"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const stopCharger = createAsyncThunk(
  "charger/stopCharger",
  async (chargerPointId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/chargers/stop`, { chargerPointId }, {
        headers: {
          "x-api-key": localStorage.getItem("identityKey"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chargerSlice = createSlice({
  name: "charger",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setChargerLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChargerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload.data) ? action.payload.data : [action.payload.data];
      })
      .addCase(fetchChargerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch charger details.";
      })
      .addCase(stopCharger.pending, (state) => {
        state.loading = true;
      })
      .addCase(stopCharger.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(stopCharger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to stop charger.";
      });
  },
});

export const { setChargerLoading } = chargerSlice.actions;
export default chargerSlice.reducer;
