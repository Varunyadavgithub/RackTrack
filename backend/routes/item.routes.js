import express from "express";
import {
  addItem,
  searchItem,
  updateItem,
  removeItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.post("/", addItem);
router.get("/search", searchItem);
router.put("/:id", updateItem);
router.delete("/remove", removeItem);

export default router;
