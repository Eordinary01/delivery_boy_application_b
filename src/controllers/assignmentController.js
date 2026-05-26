const db = require("../config/db");

//  assign order -> delivery boy
exports.assignOrder = async (req, res) => {
  try {
    const { order_id, delivery_boy_id } = req.body;

    if (!order_id || !delivery_boy_id) {
      return res
        .status(400)
        .json({ error: "order_id and delivery_boy_id are required" });
    }

    // check for order exists
    const [orders] = await db.query("SELECT * FROM orders where id =?", [
      order_id,
    ]);

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (orders[0].status !== "pending") {
      return res.status(400).json({
        error: `Order must be pending to assign. Current status: ${orders[0].status}`,
      });
    }
    // check if boy exists and has required role
    const [boys] = await db.query(
      'SELECT * FROM users WHERE id =? AND role = "delivery_boy"',
      [delivery_boy_id],
    );

    if (boys.length === 0) {
      return res.status(404).json({ error: " Delivery boy not found!!" });
    }

    const [activeAssignments] = await db.query(
      `SELECT COUNT(*) as count FROM assignments a 
       JOIN orders o ON a.order_id = o.id 
       WHERE a.delivery_boy_id =? AND o.status IN ('assigned', 'in_transit')`,
      [delivery_boy_id],
    );

    if (activeAssignments[0].count >= 3) {
      return res.status(400).json({
        error:
          "Delivery boy already has max assignments assigned. Complete existing orders first..",
      });
    }

    //  check if order is already assigned

    const [existingAssignment] = await db.query(
      "SELECT * FROM assignments WHERE order_id =?",
      [order_id],
    );

    if (existingAssignment.length > 0) {
      return res
        .status(400)
        .json({ error: " Order is already assigned to a delivery boy.." });
    }
    await db.query(
      "INSERT INTO assignments (order_id,delivery_boy_id) VALUES(?,?)",
      [order_id, delivery_boy_id],
    );

    // update order status
    await db.query('UPDATE orders SET status ="assigned" WHERE id=?', [
      order_id,
    ]);

    res.status(201).json({
      message: "Order assigned Successfully..",
      order_id: order_id,
      delivery_boy_id: delivery_boy_id,
      delivery_boy_name: boys[0].name,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Server Error." });
  }
};
//  GET all orders assigned to a specifc delivery boy

exports.getDeliveryBoyOrders = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if delivery boy exists
    const [boys] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = "delivery_boy"',
      [id],
    );

    if (boys.length === 0) {
      return res.status(404).json({ error: "Delivery boy not found" });
    }

    const [assignments] = await db.query(
      `SELECT 
        o.*, 
        a.assigned_at,
        u.name as delivery_boy_name
       FROM orders o 
       JOIN assignments a ON o.id = a.order_id 
       JOIN users u ON a.delivery_boy_id = u.id
       WHERE a.delivery_boy_id = ? 
       ORDER BY a.assigned_at DESC`,
      [id],
    );

    res.json({
      delivery_boy: {
        id: boys[0].id,
        name: boys[0].name,
        email: boys[0].email,
      },
      total_assignments: assignments.length,
      orders: assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
