const db = require("../config/db");
// get assigned orders--Delivery boy Only
exports.getMyOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;

    const [orders] = await db.query(
      `SELECT
            o.*,
            a.assigned_at,
            DATEDIFF(NOW(), a.assigned_at) as days_assigned
            FROM orders o
            JOIN assignments a ON o.id =a.order_id
            WHERE a.delivery_boy_id=?
            ORDER BY 
            CASE o.status
            WHEN 'assigned' THEN 1
            WHEN 'in_transit' THEN 2
            WHEN 'delivered' THEN 3
            ELSE 4
            END,
            a.assigned_at ASC`,
      [deliveryBoyId],
    );

    res.json({ total_orders: orders.length, orders: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error.." });
  }
};
// Update order status-- Delivery boy only
exports.updateMyOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const deliveryBoyId = req.user.id;

    // Delivery boys can ONLY update to in_transit or delivered
    if (!["in_transit", "delivered"].includes(status)) {
      return res.status(400).json({
        error: 'You can only update status to "in_transit" or "delivered"',
      });
    }

    // Check if order exists
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const currentStatus = orders[0].status;

    // Check if order is assigned to this delivery boy
    const [assignments] = await db.query(
      "SELECT * FROM assignments WHERE order_id = ? AND delivery_boy_id = ?",
      [id, deliveryBoyId],
    );

    if (assignments.length === 0) {
      return res.status(403).json({
        error:
          "This order is not assigned to you. You can only update your own orders.",
      });
    }

    const isValidTransition =
      (currentStatus === "assigned" && status === "in_transit") ||
      (currentStatus === "in_transit" && status === "delivered");

    if (!isValidTransition) {
      return res.status(400).json({
        error: `Invalid status transition from "${currentStatus}" to "${status}". 
                Allowed: assigned → in_transit → delivered`,
      });
    }

    // Update order status
    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    res.json({
      message: `Order #${id} status updated successfully`,
      order_id: id,
      old_status: currentStatus,
      new_status: status,
      updated_by: req.user.name || "Delivery Boy",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
