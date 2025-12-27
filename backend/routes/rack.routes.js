import express from "express";
import {
  createRack,
  getAllRacks,
  getRackById,
  updateRack,
  deleteRack,
} from "../controllers/rack.controller.js";

const router = express.Router();

router.post("/", createRack);
router.get("/", getAllRacks);
router.get("/:id", getRackById);
router.put("/:id", updateRack);
router.delete("/:id", deleteRack);

export default router;
