import { sql } from "../config/db.js";

/* ======================
   ADD ITEM TO RACK
====================== */
export const addRackItem = async (req, res) => {
  try {
    const { materialId, rackId, shelfId, quantity } = req.body;

    if (!materialId || !rackId || !shelfId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the material already exists in this rack+shelf
    const existing = (await sql`
      SELECT * FROM rack_items
      WHERE material_id = ${materialId} AND rack_id = ${rackId} AND shelf_id = ${shelfId}
    `)[0];

    let rackItem;
    if (existing) {
      const newQuantity = existing.quantity + Number(quantity);
      rackItem = (
        await sql`
          UPDATE rack_items
          SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing.id}
          RETURNING *
        `
      )[0];
    } else {
      rackItem = (
        await sql`
          INSERT INTO rack_items (material_id, rack_id, shelf_id, quantity)
          VALUES (${materialId}, ${rackId}, ${shelfId}, ${quantity})
          RETURNING *
        `
      )[0];
    }

    res.status(201).json(rackItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET RACK ITEMS
====================== */
export const getRackItems = async (req, res) => {
  try {
    const { rackId, shelfId } = req.query;

    let query = `
      SELECT ri.id as rack_item_id, ri.quantity, ri.created_at, ri.updated_at,
             m.id as material_id, m.material_name, m.material_description, m.material_weight, m.material_type,
             r.id as rack_id, r.rack_name,
             s.id as shelf_id, s.shelf_name
      FROM rack_items ri
      JOIN materials m ON ri.material_id = m.id
      JOIN racks r ON ri.rack_id = r.id
      JOIN shelves s ON ri.shelf_id = s.id
    `;

    const conditions = [];
    if (rackId) conditions.push(`ri.rack_id = ${rackId}`);
    if (shelfId) conditions.push(`ri.shelf_id = ${shelfId}`);
    if (conditions.length > 0) query += ` WHERE ` + conditions.join(" AND ");
    query += ` ORDER BY r.rack_name, s.shelf_name, m.material_name`;

    const items = await sql.query(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   UPDATE RACK ITEM
====================== */
export const updateRackItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined)
      return res.status(400).json({ message: "Quantity is required" });

    const item = (
      await sql`
        UPDATE rack_items
        SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    )[0];

    if (!item) return res.status(404).json({ message: "Rack item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   DELETE RACK ITEM
====================== */
export const deleteRackItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = (
      await sql`
        DELETE FROM rack_items
        WHERE id = ${id}
        RETURNING *
      `
    )[0];

    if (!item) return res.status(404).json({ message: "Rack item not found" });

    res.json({ message: "Rack item deleted successfully", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
