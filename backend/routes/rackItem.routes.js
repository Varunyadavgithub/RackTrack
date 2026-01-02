import express from "express";
import {
  addRackItem,
  getRackItems,
  updateRackItem,
  deleteRackItem,
} from "../controllers/rackItem.controller.js";

const router = express.Router();

// Get all rack items, optionally filtered by rackId/shelfId
router.get("/", getRackItems);

// Add a new item to a rack
router.post("/", addRackItem);

// Update a rack item by ID
router.put("/:id", updateRackItem);

// Delete a rack item by ID
router.delete("/", deleteRackItem);

export default router;
