import { sql } from "../config/db.js";
import { nanoid } from "nanoid";

/* ======================
   CREATE / UPSERT RACK
====================== */
export const createRack = async (req, res) => {
  try {
    const { rackNumber, location, area, capacityKg } = req.body;

    if (!rackNumber) {
      return res.status(400).json({ message: "rackNumber is required" });
    }

    const rack = (
      await sql`
      INSERT INTO racks (
        rack_id,
        rack_number,
        location,
        area,
        capacity_kg
      )
      VALUES (
        ${nanoid(8)},
        ${rackNumber},
        ${location || null},
        ${area || null},
        ${capacityKg || null}
      )
      ON CONFLICT (rack_number)
      DO UPDATE SET
        location = EXCLUDED.location,
        area = EXCLUDED.area,
        capacity_kg = EXCLUDED.capacity_kg
      RETURNING *
    `
    )[0];

    res.status(201).json(rack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET ALL RACKS (SUMMARY)
====================== */
export const getAllRacks = async (req, res) => {
  try {
    const racks = await sql`
      SELECT
        r.rack_id,
        r.rack_number,
        r.location,
        r.area,
        r.capacity_kg,
        COUNT(DISTINCT s.shelf_id) AS shelf_count,
        COUNT(i.item_id) AS item_count
      FROM racks r
      LEFT JOIN shelves s ON s.rack_id = r.rack_id
      LEFT JOIN items i ON i.rack_id = r.rack_id
      GROUP BY r.rack_id
      ORDER BY r.rack_number;
    `;

    res.json(racks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET SINGLE RACK (DETAIL)
====================== */
export const getRackById = async (req, res) => {
  try {
    const { id } = req.params;

    const rack = (
      await sql`
      SELECT
        rack_id,
        rack_number,
        location,
        area,
        capacity_kg
      FROM racks
      WHERE rack_id = ${id}
    `
    )[0];

    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    const shelves = await sql`
      SELECT
        s.shelf_id,
        s.shelf_number,
        COUNT(i.item_id) AS item_count
      FROM shelves s
      LEFT JOIN items i ON i.shelf_id = s.shelf_id
      WHERE s.rack_id = ${id}
      GROUP BY s.shelf_id
      ORDER BY s.shelf_number;
    `;

    rack.shelves = shelves;
    res.json(rack);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   UPDATE RACK
====================== */
export const updateRack = async (req, res) => {
  try {
    const { id } = req.params;
    const { rack_number, location, area, capacityKg } = req.body;

    // Build dynamic SET clause manually
    const updates = [];
    const values = [];

    if (rack_number !== undefined) {
      values.push(rack_number);
      updates.push(`rack_number = $${values.length}`);
    }
    if (location !== undefined) {
      values.push(location);
      updates.push(`location = $${values.length}`);
    }
    if (area !== undefined) {
      values.push(area);
      updates.push(`area = $${values.length}`);
    }
    if (capacityKg !== undefined) {
      values.push(capacityKg);
      updates.push(`capacity_kg = $${values.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id); // last parameter = rack_id

    const query = `
      UPDATE racks
      SET ${updates.join(", ")}
      WHERE rack_id = $${values.length}
      RETURNING *
    `;

    const result = await sql.query(query, values);
    const rack = result[0];

    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    res.json(rack);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Rack number already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   DELETE RACK
====================== */
export const deleteRack = async (req, res) => {
  try {
    const { id } = req.params;

    const rack = (
      await sql`
      DELETE FROM racks
      WHERE rack_id = ${id}
      RETURNING *
    `
    )[0];

    if (!rack) {
      return res.status(404).json({ message: "Rack not found" });
    }

    res.json({ message: "Rack deleted successfully", rack });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
