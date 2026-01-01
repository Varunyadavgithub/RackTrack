import express from "express";
import { getMaterialBySapCode } from "../controllers/material.controller.js";

const router = express.Router();

router.get("/sap/:sapCode", getMaterialBySapCode);

export default router;
