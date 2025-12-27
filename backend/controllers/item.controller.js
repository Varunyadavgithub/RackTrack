import { sql } from "../config/db.js";

// Add Item
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

    // Create or get Rack
    const rack = (
      await sql`
      INSERT INTO racks (rack_number)
      VALUES (${rackNumber})
      ON CONFLICT (rack_number) DO UPDATE SET rack_number = EXCLUDED.rack_number
      RETURNING id
    `
    )[0];

    // Create or get Shelf
    const shelf =
      (
        await sql`
      INSERT INTO shelves (shelf_number, rack_id)
      VALUES (${shelfNumber}, ${rack.id})
      ON CONFLICT DO NOTHING
      RETURNING id
    `
      )[0] ||
      (
        await sql`SELECT id FROM shelves WHERE rack_id = ${rack.id} AND shelf_number = ${shelfNumber}`
      )[0];

    // Add Item
    const item = (
      await sql`
      INSERT INTO items (sap_code, item_name, description, quantity, rack_id, shelf_id)
      VALUES (${sapCode}, ${itemName}, ${description || ""}, ${quantity}, ${
        rack.id
      }, ${shelf.id})
      ON CONFLICT (sap_code, rack_id, shelf_id) 
      DO UPDATE SET quantity = items.quantity + EXCLUDED.quantity, last_updated = NOW()
      RETURNING *
    `
    )[0];

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search Item
export const searchItem = async (req, res) => {
  try {
    const { rack, shelf, sap } = req.query;

    // Build conditions dynamically
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
      SELECT i.*, r.rack_number, s.shelf_number
      FROM items i
      JOIN racks r ON i.rack_id = r.id
      JOIN shelves s ON i.shelf_id = s.id
    `;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Use sql.query() for fully dynamic SQL with $1, $2, etc.
    const result = await sql.query(query, values);

    if (!result.length)
      return res.status(404).json({ message: "Item not found" });

    res.json(result.length === 1 ? result[0] : result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = (
      await sql`
      UPDATE items
      SET quantity = ${quantity}, last_updated = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    )[0];

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove Item
export const removeItem = async (req, res) => {
  try {
    const { rack, shelf, sap, quantity } = req.body; // send these in request body

    if (!rack || !shelf || !sap || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "rack, shelf, sap, and quantity are required" });
    }

    // Build delete query dynamically
    const query = `
      DELETE FROM items
      USING racks r, shelves s
      WHERE items.rack_id = r.id
        AND items.shelf_id = s.id
        AND r.rack_number = $1
        AND s.shelf_number = $2
        AND items.sap_code = $3
        AND items.quantity = $4
      RETURNING *;
    `;

    const result = await sql.query(query, [rack, shelf, sap, quantity]);

    if (!result.length) {
      return res
        .status(404)
        .json({ message: "Item not found or already removed" });
    }

    res.json({ message: "Item removed successfully", removedItem: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
