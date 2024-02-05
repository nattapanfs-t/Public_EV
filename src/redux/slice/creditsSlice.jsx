import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = window.Configs.urlApi;

const initialState = {
  creditData: null,
  loading: false,
  error: null,
};

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    fetchCreditStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCreditSuccess: (state, action) => {
      state.loading = false;
      state.creditData = action.payload;
    },
    fetchCreditFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCreditStart,
  fetchCreditSuccess,
  fetchCreditFailure,
} = creditsSlice.actions;

export const fetchCredit = (userId) => async (dispatch) => {
  if (!userId) {
    dispatch(fetchCreditFailure("User ID is not defined"));
    return;
  }
  dispatch(fetchCreditStart());

  try {
    const response = await axios.get(`${URL}/credits/${userId}`);
    dispatch(fetchCreditSuccess(response.data.data));
  } catch (error) {
    dispatch(fetchCreditFailure(error.message));
  }
};

export default creditsSlice.reducer;
