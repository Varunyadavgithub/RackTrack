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
    // Fetch racks with their shelves and items
    const rows = await sql`
      SELECT
        r.rack_id,
        r.rack_number,
        r.location,
        r.area,
        r.capacity_kg,
        s.shelf_id,
        s.shelf_number,
        i.item_id,
        i.sap_code,
        i.item_name,
        i.description,
        i.quantity,
        i.last_updated
      FROM racks r
      LEFT JOIN shelves s ON s.rack_id = r.rack_id
      LEFT JOIN items i ON i.shelf_id = s.shelf_id
      ORDER BY r.rack_number, s.shelf_number, i.item_name;
    `;

    // Transform flat rows into nested JSON
    const racksMap = {};

    rows.forEach((row) => {
      if (!racksMap[row.rack_id]) {
        racksMap[row.rack_id] = {
          _id: row.rack_id,
          rackNumber: row.rack_number,
          location: row.location,
          area: row.area,
          capacity: row.capacity_kg,
          shelves: [],
        };
      }

      if (row.shelf_id) {
        let shelf = racksMap[row.rack_id].shelves.find(
          (s) => s._id === row.shelf_id
        );

        if (!shelf) {
          shelf = {
            _id: row.shelf_id,
            rackId: row.rack_id,
            shelfNumber: row.shelf_number,
            items: [],
          };
          racksMap[row.rack_id].shelves.push(shelf);
        }

        if (row.item_id) {
          shelf.items.push({
            _id: row.item_id,
            sapCode: row.sap_code,
            itemName: row.item_name,
            description: row.description,
            quantity: row.quantity,
            rackId: row.rack_id,
            shelfId: row.shelf_id,
            lastUpdated: row.last_updated,
          });
        }
      }
    });

    const racks = Object.values(racksMap);

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

    // Fetch rack info
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

    // Fetch shelves for this rack
    const shelves = await sql`
      SELECT
        s.shelf_id,
        s.shelf_number
      FROM shelves s
      WHERE s.rack_id = ${id}
      ORDER BY s.shelf_number;
    `;

    // Fetch items for each shelf
    for (let shelf of shelves) {
      const items = await sql`
        SELECT
          i.item_id,
          i.sap_code,
          i.item_name,
          i.description,
          i.quantity,
          i.rack_id,
          i.shelf_id,
          i.last_updated
        FROM items i
        WHERE i.shelf_id = ${shelf.shelf_id};
      `;
      // Attach items to shelf
      shelf.items = items.map((item) => ({
        _id: item.item_id,
        sapCode: item.sap_code,
        itemName: item.item_name,
        description: item.description,
        quantity: item.quantity,
        rackId: item.rack_id,
        shelfId: item.shelf_id,
        lastUpdated: item.last_updated,
      }));

      // Rename shelf properties for frontend consistency
      shelf._id = shelf.shelf_id;
      shelf.shelfNumber = shelf.shelf_number;
      delete shelf.shelf_id;
      delete shelf.shelf_number;
    }

    // Attach shelves to rack
    rack.shelves = shelves.map((shelf) => ({
      _id: shelf._id,
      shelfNumber: shelf.shelfNumber,
      items: shelf.items,
      rackId: rack.rack_id,
    }));

    // Format rack for frontend consistency
    const formattedRack = {
      _id: rack.rack_id,
      rackNumber: rack.rack_number,
      location: rack.location,
      area: rack.area,
      capacity: rack.capacity_kg,
      shelves: rack.shelves,
    };

    res.json(formattedRack);
  } catch (err) {
    console.error(err);
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
