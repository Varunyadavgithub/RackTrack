import { sql } from "../config/db.js";

/* ======================
   GET ALL MATERIALS
====================== */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await sql`SELECT * FROM materials`;
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET MATERIAL BY ID
====================== */
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = (await sql`
      SELECT * FROM materials WHERE id = ${id}
    `)[0];

    if (!material) return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
