import express from "express";
import rackRoutes from "./rack.routes.js";
import itemRoutes from "./item.routes.js";

const app = express();

app.use("/racks", rackRoutes);
app.use("/items", itemRoutes);

export default app;
