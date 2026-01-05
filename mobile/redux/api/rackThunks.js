import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./apiClient.js";

/* Fetch all racks */
export const fetchRacks = createAsyncThunk(
  "racks/fetchRacks",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient("/racks");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* Fetch shelves for a rack */
export const fetchShelves = createAsyncThunk(
  "racks/fetchShelves",
  async (rack, { rejectWithValue }) => {
    try {
      return await apiClient(`/racks/${rack}/shelves`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
