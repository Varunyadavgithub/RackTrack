import { sql } from "../config/db.js";

/* ======================
   ADD INVENTORY TRANSACTION
====================== */
export const addInventoryTransaction = async (req, res) => {
  try {
    const { rackItemId, type, quantity } = req.body;

    if (!rackItemId || !type || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = (
      await sql`
        INSERT INTO inventory_transactions (rack_item_id, type, quantity)
        VALUES (${rackItemId}, ${type}, ${quantity})
        RETURNING *
      `
    )[0];

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET ALL TRANSACTIONS
====================== */
export const getInventoryTransactions = async (req, res) => {
  try {
    const transactions = await sql`
      SELECT t.id, t.type, t.quantity, t.created_at,
             ri.id as rack_item_id,
             m.material_name, r.rack_name, s.shelf_name
      FROM inventory_transactions t
      JOIN rack_items ri ON t.rack_item_id = ri.id
      JOIN materials m ON ri.material_id = m.id
      JOIN racks r ON ri.rack_id = r.id
      JOIN shelves s ON ri.shelf_id = s.id
      ORDER BY t.created_at DESC
    `;

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
