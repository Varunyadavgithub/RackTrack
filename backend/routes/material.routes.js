import express from "express";
import {
  getAllMaterials,
  getMaterialById,
} from "../controllers/material.controller.js";

const router = express.Router();

// Get all materials
router.get("/", getAllMaterials);

// Get single material by ID
router.get("/:id", getMaterialById);

export default router;
