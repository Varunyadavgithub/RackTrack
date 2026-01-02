import express from "express";
import {
  getAllMaterials,
  getMaterialBySapCode,
} from "../controllers/material.controller.js";

const router = express.Router();

// Get all materials
router.get("/", getAllMaterials);

// Get single material by SAP Code
router.get("/:sapCode", getMaterialBySapCode);

export default router;
