import express from "express";
import { getRacks } from "../controllers/rack.controller.js";

const router = express.Router();

router.get("/", getRacks);

export default router;
