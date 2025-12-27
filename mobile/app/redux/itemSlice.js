import { createSlice } from "@reduxjs/toolkit";
import {
  addItem,
  searchItem,
  updateItem,
  deleteItem,
} from "./api/itemThunks.js";

const itemSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchItem.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(searchItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      });
  },
});

export default itemSlice.reducer;
