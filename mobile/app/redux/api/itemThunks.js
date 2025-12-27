import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./apiClient.js";

// Add Item
export const addItem = createAsyncThunk("items/add", async (data, thunkAPI) => {
  try {
    return await apiClient("/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Search Item
export const searchItem = createAsyncThunk(
  "items/search",
  async (query, thunkAPI) => {
    try {
      return await apiClient(`/items/serach?${query}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Item
export const updateItem = createAsyncThunk(
  "items/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await apiClient(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Delete Item
export const deletetem = createAsyncThunk(
  "items/delete",
  async (id, thunkAPI) => {
    try {
      await apiClient(`/items/${id}`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
