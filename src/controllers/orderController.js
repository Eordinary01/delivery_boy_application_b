const db = require('../config/db');

// new order(admin)
exports.createOrder = async (req, res) => {
  try {
    const { customer_name, pickup_address, delivery_address } = req.body;
    
    // Validation
    if (!customer_name || !pickup_address || !delivery_address) {
      return res.status(400).json({ 
        error: 'All fields are required: customer_name, pickup_address, delivery_address' 
      });
    }
    
    // Insert order
    const [result] = await db.query(
      'INSERT INTO orders (customer_name, pickup_address, delivery_address) VALUES (?, ?, ?)',
      [customer_name, pickup_address, delivery_address]
    );
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: result.insertId 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// all orders with filters
exports.getAllOrders = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    
    if (date) {
      query += ' AND DATE(created_at) = ?';
      params.push(date);
    }
    
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [orders] = await db.query(query, params);
    
    // total count
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM orders');
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, data: orders[0] });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// order status 
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Valid statuses: pending, assigned, in_transit, delivered, cancelled' 
      });
    }
    
    // order exists or not 
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update status
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    res.json({ 
      message: 'Order status updated successfully',
      old_status: orders[0].status,
      new_status: status
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};