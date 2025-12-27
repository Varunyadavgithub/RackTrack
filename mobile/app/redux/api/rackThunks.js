import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./apiClient.js";

// Get all racks
export const fetchRacks = createAsyncThunk(
  "racks/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await apiClient("/racks");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get rack by ID
export const fetchRackByID = createAsyncThunk(
  "racks/fetchById",
  async (id, thunkAPI) => {
    try {
      return await apiClient(`/racks/${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create rack
export const createRack = createAsyncThunk(
  "racks/create",
  async (data, thunkAPI) => {
    try {
      return await apiClient("/racks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
