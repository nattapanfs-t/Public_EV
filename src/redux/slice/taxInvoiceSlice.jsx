import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = window.Configs.urlApi;

const initialState = {
  taxInvoiceData: null,
  taxInvoiceLoading: false,
  taxInvoiceError: null,
};

export const postTaxInvoice = createAsyncThunk(
  "taxInvoice/postTaxInvoice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/tax/TaxInvoice`, null, {
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

const taxInvoiceSlice = createSlice({
  name: "taxInvoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postTaxInvoice.pending, (state) => {
        state.taxInvoiceLoading = true;
      })
      .addCase(postTaxInvoice.fulfilled, (state, action) => {
        state.taxInvoiceLoading = false;
        state.taxInvoiceData = action.payload;
      })
      .addCase(postTaxInvoice.rejected, (state, action) => {
        state.taxInvoiceLoading = false;
        state.taxInvoiceError = action.payload || "Failed to post tax invoice.";
      });
  },
});

export default taxInvoiceSlice.reducer;
