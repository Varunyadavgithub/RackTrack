import express from "express";
import {
  addRackItem,
  getRackItems,
  updateRackItem,
  deleteRackItem,
} from "../controllers/rackItem.controller.js";

const router = express.Router();

router.get("/search", getRackItems);
router.post("/", addRackItem);
router.put("/:id", updateRackItem);
router.delete("/", deleteRackItem);

export default router;
