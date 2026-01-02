import express from "express";
import materialRoutes from "./material.routes.js";
import rackRoutes from "./rack.routes.js";
import rackItemRoutes from "./rackItem.routes.js";
import inventoryTransactionRoutes from "./inventoryTransaction.routes.js";

const router = express.Router();

router.use("/materials", materialRoutes);
router.use("/racks", rackRoutes);
router.use("/rack-items", rackItemRoutes);
router.use("/inventory-transactions", inventoryTransactionRoutes);

export default router;
