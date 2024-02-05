import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = window.Configs.urlApi;

const initialState = {
  data: null,
  loading: false,
  error: null,
  selectedPackageId: null,
};

export const fetchPackageDetails = createAsyncThunk(
  "package/fetchPackageDetails",
  async () => {
    try {
      const response = await fetch(`${URL}/packages`);
      const data = await response.json();

      const packagesWithImages = data.data.map((pkg) => ({
        ...pkg,
        imageUrl: pkg.packageImage ? `${URL}/FileStore/${pkg.packageImage}` : null,
      }));

      return packagesWithImages;
    } catch (error) {
      throw error;
    }
  }
);

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    setSelectedPackageId: (state, action) => {
      state.selectedPackageId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPackageDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedPackageId } = packageSlice.actions;

export default packageSlice.reducer;
