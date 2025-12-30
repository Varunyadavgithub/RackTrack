import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "./apiClient.js";

// Get all racks
export const fetchRacks = createAsyncThunk(
  "racks/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient("/rack");
      return response;
    } catch (error) {
      console.log("API error:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get rack by ID
export const fetchRackById = createAsyncThunk(
  "racks/fetchById",
  async (id, thunkAPI) => {
    try {
      return await apiClient(`/rack/${id}`);
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
      return await apiClient("/rack", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
