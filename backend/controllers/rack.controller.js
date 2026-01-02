import { sql } from "../config/db.js";

/* ======================
   GET ALL RACKS
====================== */
export const getAllRacks = async (req, res) => {
  try {
    const racks = await sql`SELECT * FROM racks`;
    res.json(racks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET ALL SHELVES FOR A RACK
====================== */
export const getShelvesByRack = async (req, res) => {
  try {
    const { rackId } = req.params;
    const shelves = await sql`
      SELECT * FROM shelves WHERE rack_id = ${rackId}
    `;
    res.json(shelves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
