import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMaterialByCode,
  addMaterial,
  deleteMaterial,
  searchMaterial,
} from "../api/materialThunks.js";

const materialSlice = createSlice({
  name: "items",
  initialState: {
    material: null,
    searchResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMaterial(state) {
      state.material = null;
    },
    clearSearchResult(state) {
      state.searchResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.material = action.payload;
      })
      .addCase(fetchMaterialByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(searchMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      .addCase(searchMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMaterial, clearSearchResult } = materialSlice.actions;

export default materialSlice.reducer;
