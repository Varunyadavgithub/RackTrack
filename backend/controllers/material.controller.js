import { sql } from "../config/db.js";

/* ======================
   fetch MATERIALS BY SAP CODE
====================== */
export const getMaterialBySapCode = async (req, res) => {
  try {
    const { sapCode } = req.params;
    const result = await sql.query(
      "SELECT * FROM materials WHERE sap_code = $1",
      [sapCode]
    );
    if (!result.length) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
