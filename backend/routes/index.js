import express from "express";
import rackRoutes from "./rack.routes.js";
import itemRoutes from "./item.routes.js";

const app = express();

app.use("/rack", rackRoutes);
app.use("/item", itemRoutes);

export default app;
