import { createSlice } from "@reduxjs/toolkit";
import { fetchRacks, fetchShelves } from "./api/rackThunks.js";

const rackSlice = createSlice({
  name: "racks",
  initialState: {
    racks: [],
    shelves: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearShelves(state) {
      state.shelves = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRacks.fulfilled, (state, action) => {
        state.loading = false;
        state.racks = action.payload;
      })
      .addCase(fetchRacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchShelves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShelves.fulfilled, (state, action) => {
        state.loading = false;
        state.shelves = action.payload;
      })
      .addCase(fetchShelves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShelves } = rackSlice.actions;
export default rackSlice.reducer;
