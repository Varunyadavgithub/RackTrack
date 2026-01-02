import { sql } from "../config/db.js";

/* ======================
   ADD ITEM TO RACK
====================== */
export const addRackItem = async (req, res) => {
  try {
    const {
      rackName,
      shelfName,
      materialName,
      materialDescription = "",
      materialWeight = 0,
      materialType = "",
      sapCode = "",
      quantity,
      woodenPalletWeight = 0,
    } = req.body;

    if (!rackName || !shelfName || !materialName || quantity === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 Check if item already exists based on rackName, shelfName, and materialName
    const existing = (
      await sql`
        SELECT * FROM rack_items
        WHERE rack_name = ${rackName} 
          AND shelf_name = ${shelfName} 
          AND material_name = ${materialName}
      `
    )[0];

    let rackItem;
    if (existing) {
      const newQuantity = existing.quantity + Number(quantity);
      const newPalletWeight =
        existing.wooden_pallet_weight + Number(woodenPalletWeight);

      rackItem = (
        await sql`
          UPDATE rack_items
          SET quantity = ${newQuantity},
              wooden_pallet_weight = ${newPalletWeight},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing.id}
          RETURNING *
        `
      )[0];
    } else {
      rackItem = (
        await sql`
          INSERT INTO rack_items 
            (rack_name, shelf_name, material_name, material_description, material_weight, material_type, sap_code, quantity, wooden_pallet_weight)
          VALUES 
            (${rackName}, ${shelfName}, ${materialName}, ${materialDescription}, ${materialWeight}, ${materialType}, ${sapCode}, ${quantity}, ${woodenPalletWeight})
          RETURNING *
        `
      )[0];
    }

    res.status(201).json(rackItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET RACK ITEMS
====================== */
export const getRackItems = async (req, res) => {
  try {
    const { rackNumber, shelfNumber, sapCode } = req.query;

    // Base query
    let query = `
      SELECT *
      FROM rack_items
    `;

    const conditions = [];
    const values = [];

    // Add conditions safely
    if (rackNumber) {
      conditions.push(`rack_name = $${values.length + 1}`);
      values.push(rackNumber);
    }
    if (shelfNumber) {
      conditions.push(`shelf_name = $${values.length + 1}`);
      values.push(shelfNumber);
    }
    if (sapCode) {
      conditions.push(`sap_code = $${values.length + 1}`);
      values.push(sapCode);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY rack_name, shelf_name, material_name`;

    const items = await sql.query(query, values);

    res.json(items);
  } catch (err) {
    console.error("Error fetching rack items:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   UPDATE RACK ITEM
====================== */
export const updateRackItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      quantity,
      woodenPalletWeight = 0,
      materialDescription,
      materialWeight,
      materialType,
      sapCode,
    } = req.body;

    if (quantity === undefined)
      return res.status(400).json({ message: "Quantity is required" });

    const item = (
      await sql`
        UPDATE rack_items
        SET quantity = ${quantity},
            wooden_pallet_weight = ${woodenPalletWeight},
            material_description = ${materialDescription || ""},
            material_weight = ${materialWeight || 0},
            material_type = ${materialType || ""},
            sap_code = ${sapCode || ""},
            updated_at = CURRENT_TIMESTAMP
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
    const { rackNumber, shelfNumber, sapCode, quantity } = req.body;

    // Make sure required fields are present
    if (!rackNumber || !shelfNumber || !sapCode || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Delete the item or reduce the quantity
    const existingItem = (
      await sql`
        SELECT * FROM rack_items
        WHERE rack_name = ${rackNumber}
          AND shelf_name = ${shelfNumber}
          AND sap_code = ${sapCode}
      `
    )[0];

    if (!existingItem) {
      return res.status(404).json({ message: "Rack item not found" });
    }

    // If the quantity to remove is >= current quantity, delete the row
    if (Number(quantity) >= existingItem.quantity) {
      const deletedItem = (
        await sql`
          DELETE FROM rack_items
          WHERE rack_name = ${rackNumber}
            AND shelf_name = ${shelfNumber}
            AND sap_code = ${sapCode}
          RETURNING *
        `
      )[0];

      return res.json({
        message: "Rack item deleted successfully",
        item: deletedItem,
      });
    }

    // Otherwise, reduce the quantity
    const updatedItem = (
      await sql`
        UPDATE rack_items
        SET quantity = quantity - ${Number(quantity)}
        WHERE rack_name = ${rackNumber}
          AND shelf_name = ${shelfNumber}
          AND sap_code = ${sapCode}
        RETURNING *
      `
    )[0];

    res.json({
      message: "Item quantity updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
