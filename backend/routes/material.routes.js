import express from "express";
import { getMaterialBySapCode } from "../controllers/material.controller.js";

const router = express.Router();

// Get single material by SAP Code
router.get("/:sapCode", getMaterialBySapCode);

export default router;
