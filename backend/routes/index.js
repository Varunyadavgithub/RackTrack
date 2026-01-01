import express from "express";
import rackRoutes from "./rack.routes.js";
import itemRoutes from "./item.routes.js";
import materialRoutes from "./material.routes.js";

const app = express();

app.use("/rack", rackRoutes);
app.use("/item", itemRoutes);
app.use("/material", materialRoutes);

export default app;
