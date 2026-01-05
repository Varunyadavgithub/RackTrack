import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "./apiClient.js";

/* Fetch material by SAP code */
export const fetchMaterialByCode = createAsyncThunk(
  "materials/fetchByCode",
  async (code, { rejectWithValue }) => {
    try {
      return await apiClient(`/materials/${code}`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* Add material to rack */
export const addMaterial = createAsyncThunk(
  "materials/addMaterial",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient("/rack-items", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* Delete material */
export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiClient("/rack-items", {
        method: "DELETE",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* Search material */
export const searchMaterial = createAsyncThunk(
  "materials/searchMaterial",
  async (query, { rejectWithValue }) => {
    try {
      return await apiClient(`/rack-items/search?${query}`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
