import {sql} from "../config/db.js";

export const getRacks = async (req, res) => {
  try {
    const rows = await sql`
      SELECT 
        r.id AS rack_id, r.rack_number, r.location, r.area, r.capacity,
        s.id AS shelf_id, s.shelf_number,
        i.id AS item_id, i.sap_code, i.item_name, i.description, i.quantity, i.last_updated
      FROM racks r
      LEFT JOIN shelves s ON s.rack_id = r.id
      LEFT JOIN items i ON i.rack_id = r.id AND i.shelf_id = s.id
      ORDER BY r.rack_number, s.shelf_number
    `;

    const rackMap = {};
    rows.forEach(row => {
      if (!rackMap[row.rack_id]) {
        rackMap[row.rack_id] = {
          _id: row.rack_id,
          rackNumber: row.rack_number,
          location: row.location,
          area: row.area,
          capacity: row.capacity,
          shelves: {},
        };
      }

      if (row.shelf_id) {
        if (!rackMap[row.rack_id].shelves[row.shelf_id]) {
          rackMap[row.rack_id].shelves[row.shelf_id] = {
            _id: row.shelf_id,
            rackId: row.rack_id,
            shelfNumber: row.shelf_number,
            items: [],
          };
        }

        if (row.item_id) {
          rackMap[row.rack_id].shelves[row.shelf_id].items.push({
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

    const result = Object.values(rackMap).map(rack => ({
      ...rack,
      shelves: Object.values(rack.shelves),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
