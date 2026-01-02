import express from "express";
import {
  getAllRacks,
  getShelvesByRack,
} from "../controllers/rack.controller.js";

const router = express.Router();

// Get all racks
router.get("/", getAllRacks);

// Get shelves of a specific rack
router.get("/:rackId/shelves", getShelvesByRack);

export default router;
