import express from "express";
import { addInventoryTransaction, getInventoryTransactions } from "../controllers/inventoryTransaction.controller.js";

const router = express.Router();

// Get all transactions
router.get("/", getInventoryTransactions);

// Add a new transaction (IN/OUT)
router.post("/", addInventoryTransaction);

export default router;
