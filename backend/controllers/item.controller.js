import { sql } from "../config/db.js";
import { nanoid } from "nanoid";

/* ======================
   ADD ITEM
====================== */
export const addItem = async (req, res) => {
  try {
    const {
      rackNumber,
      shelfNumber,
      sapCode,
      itemName,
      description,
      quantity,
    } = req.body;

    /* ---- RACK ---- */
    const rack = (
      await sql`
      INSERT INTO racks (rack_id, rack_number)
      VALUES (${nanoid(8)}, ${rackNumber})
      ON CONFLICT (rack_number)
      DO UPDATE SET rack_number = EXCLUDED.rack_number
      RETURNING rack_id
    `
    )[0];

    /* ---- SHELF ---- */
    const shelf =
      (
        await sql`
        INSERT INTO shelves (shelf_id, rack_id, shelf_number)
        VALUES (${nanoid(8)}, ${rack.rack_id}, ${shelfNumber})
        ON CONFLICT (rack_id, shelf_number) DO NOTHING
        RETURNING shelf_id
      `
      )[0] ||
      (
        await sql`
        SELECT shelf_id
        FROM shelves
        WHERE rack_id = ${rack.rack_id}
          AND shelf_number = ${shelfNumber}
      `
      )[0];

    /* ---- ITEM ---- */
    const item = (
      await sql`
      INSERT INTO items (
        item_id,
        sap_code,
        item_name,
        description,
        quantity,
        rack_id,
        shelf_id,
        last_updated
      )
      VALUES (
        ${nanoid(8)},
        ${sapCode},
        ${itemName},
        ${description || ""},
        ${quantity},
        ${rack.rack_id},
        ${shelf.shelf_id},
        NOW()
      )
      ON CONFLICT (sap_code, rack_id, shelf_id)
      DO UPDATE SET
        quantity = items.quantity + EXCLUDED.quantity,
        last_updated = NOW()
      RETURNING *
    `
    )[0];

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   SEARCH ITEM
====================== */
export const searchItem = async (req, res) => {
  try {
    const { rack, shelf, sap } = req.query;

    const conditions = [];
    const values = [];

    if (rack) {
      conditions.push(`r.rack_number = $${values.length + 1}`);
      values.push(rack);
    }
    if (shelf) {
      conditions.push(`s.shelf_number = $${values.length + 1}`);
      values.push(shelf);
    }
    if (sap) {
      conditions.push(`i.sap_code = $${values.length + 1}`);
      values.push(sap);
    }

    let query = `
      SELECT
        i.item_id,
        i.sap_code,
        i.item_name,
        i.description,
        i.quantity,
        i.last_updated,
        r.rack_number,
        s.shelf_number
      FROM items i
      JOIN racks r ON i.rack_id = r.rack_id
      JOIN shelves s ON i.shelf_id = s.shelf_id
    `;

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await sql.query(query, values);

    if (!result.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(result.length === 1 ? result[0] : result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   UPDATE ITEM
====================== */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sapCode,
      itemName,
      description,
      quantity,
      rackNumber,
      shelfNumber,
    } = req.body;

    // Build dynamic SET clause
    const updates = [];
    const values = [];

    if (sapCode !== undefined) {
      values.push(sapCode);
      updates.push(`sap_code = $${values.length}`);
    }
    if (itemName !== undefined) {
      values.push(itemName);
      updates.push(`item_name = $${values.length}`);
    }
    if (description !== undefined) {
      values.push(description);
      updates.push(`description = $${values.length}`);
    }
    if (quantity !== undefined) {
      values.push(quantity);
      updates.push(`quantity = $${values.length}`);
    }

    // Optional: update rack and shelf if provided
    let rackId, shelfId;
    if (rackNumber) {
      const rack = (
        await sql`SELECT id FROM racks WHERE rack_number = ${rackNumber}`
      )[0];
      if (!rack) return res.status(404).json({ message: "Rack not found" });
      rackId = rack.id;
      values.push(rackId);
      updates.push(`rack_id = $${values.length}`);
    }
    if (shelfNumber) {
      if (!rackId)
        return res
          .status(400)
          .json({ message: "Provide rackNumber to update shelf" });
      const shelf = (
        await sql`
        SELECT id FROM shelves
        WHERE shelf_number = ${shelfNumber} AND rack_id = ${rackId}
      `
      )[0];
      if (!shelf) return res.status(404).json({ message: "Shelf not found" });
      shelfId = shelf.id;
      values.push(shelfId);
      updates.push(`shelf_id = $${values.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Always update last_updated
    updates.push(`last_updated = NOW()`);

    // Add item_id to WHERE clause
    values.push(id);
    const query = `
      UPDATE items
      SET ${updates.join(", ")}
      WHERE item_id = $${values.length}
      RETURNING *
    `;

    const item = (await sql.query(query, values))[0];

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        message:
          "Item with this SAP code already exists on the same rack/shelf",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   REMOVE ITEM
====================== */
export const removeItem = async (req, res) => {
  try {
    const { rack, shelf, sap } = req.body;

    const query = `
      DELETE FROM items i
      USING racks r, shelves s
      WHERE i.rack_id = r.rack_id
        AND i.shelf_id = s.shelf_id
        AND r.rack_number = $1
        AND s.shelf_number = $2
        AND i.sap_code = $3
      RETURNING *;
    `;

    const result = await sql.query(query, [rack, shelf, sap]);

    if (!result.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed", removedItem: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
