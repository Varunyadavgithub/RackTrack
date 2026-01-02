import { sql } from "../config/db.js";

/* ======================
   GET MATERIAL BY SAP CODE
====================== */
export const getMaterialBySapCode = async (req, res) => {
  try {
    const { sapCode } = req.params;
    const material = (
      await sql`
      SELECT * FROM materials WHERE sap_code = ${sapCode}
    `
    )[0];

    if (!material)
      return res.status(404).json({ message: "Material not found" });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
