import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const URL = window.Configs.urlApi;

export const generateQRCode = createAsyncThunk(
  "payment/generateQRCode",
  async ({ PackageId, PackagePrice, PackageCustomizedId, UserId, ChargePointId }) => {
    try {
      const response = await axios.post(`${URL}/payment/qrcode`, {
        PackageId,
        PackagePrice,
        PackageCustomizedId,
        UserId,
        ChargePointId,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const makePayment = createAsyncThunk(
  "payment/makePayment",
  async ({ ReferenceNo, chargerId, chargePointId, PackageId, UserId }) => {
    try {
      const response = await axios.post(`${URL}/payment/paid`, {
        ReferenceNo,
        chargerId,
        chargePointId,
        PackageId,
        UserId,
      });
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      throw error.response.data;
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    qrdata: null,
    qrcodeLoading: false,
    qrcodeError: null,
    paidLoading: false,
    paidError: null,
    paymentResult: null,
    referenceNo: null,
    image: null,
  },
  reducers: {
    setImageData: (state, action) => {
    state.image = action.payload;
    localStorage.setItem('imageData', action.payload);
  },},
  extraReducers: (builder) => {
    builder
      .addCase(generateQRCode.pending, (state) => {
        state.qrcodeLoading = true;
        state.qrcodeError = null;
      })
      .addCase(generateQRCode.fulfilled, (state, action) => {
        state.qrcodeLoading = false;
        state.qrdata = action.payload;
        state.image = action.payload.data?.image;
      })
      .addCase(generateQRCode.rejected, (state, action) => {
        state.qrcodeLoading = false;
        state.qrcodeError = action.error.message;
      })
      .addCase(makePayment.pending, (state) => {
        state.paidLoading = true;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.paidLoading = false;
        state.paymentResult = action.payload;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.paidLoading = false;
        state.paidError = action.error.message;
      });
  },
});

export const selectReferenceNo = (state) => state.payment?.referenceNo;
export const selectImageData = (state) => state.payment?.image;
export const { setImageData } = paymentSlice.actions;
export default paymentSlice.reducer;
