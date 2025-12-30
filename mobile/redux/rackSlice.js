import { createSlice } from "@reduxjs/toolkit";
import { fetchRacks, fetchRackById, createRack } from "./api/rackThunks.js";

const rackSlice = createSlice({
  name: "racks",
  initialState: {
    list: [],
    selectedRack: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRack: (state) => {
      state.selectedRack = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all racks
      .addCase(fetchRacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRacks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch rack by ID
      .addCase(fetchRackById.fulfilled, (state, action) => {
        state.selectedRack = action.payload;
      })

      // Create rack
      .addCase(createRack.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export const { clearSelectedRack } = rackSlice.actions;
export default rackSlice.reducer;
