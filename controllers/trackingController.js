const db = require("../config/db");

exports.getTrackingInfo = async (req, res) => {
  const { package_id } = req.params;

  try {
    const query = `
      SELECT 
        th.package_id,
        w.name AS warehouse_location,
        p.name AS post_office_location,
        th.status,
        th.updated_at,
        r.route_name
      FROM trackinghistory th
      LEFT JOIN warehouses w ON th.warehouse_location = w.ware_id
      LEFT JOIN postoffices p ON th.post_office_location = p.post_id
      LEFT JOIN routes r ON th.route_id = r.route_id
      WHERE th.package_id = ?
      ORDER BY th.updated_at DESC;
    `;

    const [rows] = await db.execute(query, [package_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tracking info not found" });
    }

    res.json({ package_id, history: rows });
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateTracking = async (req, res) => {
  const { package_id, warehouse_location, post_office_location, status, route_id } = req.body;

  try {
    await db.execute(
      "INSERT INTO trackinghistory (package_id, warehouse_location, post_office_location, status, updated_at, route_id) VALUES (?, ?, ?, ?, NOW(), ?)", 
      [package_id, warehouse_location, post_office_location, status, route_id]
    );

    res.json({ message: "Tracking updated successfully" });
  } catch (error) {
    console.error("Error updating tracking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
