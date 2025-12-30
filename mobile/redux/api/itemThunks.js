import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "./apiClient.js";

// Add Item
export const addItem = createAsyncThunk("item/add", async (data, thunkAPI) => {
  try {
    return await apiClient("/item", {
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
      const response = await apiClient(`/item/search?${query}`);
      return response;
    } catch (error) {
      console.log("API error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Item
export const updateItem = createAsyncThunk(
  "items/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await apiClient(`/item/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Delete Item
export const deleteItem = createAsyncThunk(
  "items/delete",
  async (data, thunkAPI) => {
    try {
      const response = await apiClient("/item/remove", {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
