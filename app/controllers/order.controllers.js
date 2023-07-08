

const { orders } = require("../models");
const db = require("../models");
const Order = db.orders;








// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { name, address, addressLatLng, paymentId, totalPrice, items,NumTelephone } = req.body;
    const order = new Order({ name, address, addressLatLng, paymentId, totalPrice, items,NumTelephone });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the orders.' });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the order.' });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, addressLatLng, paymentId, totalPrice, items } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { name, address, addressLatLng, paymentId, totalPrice, items },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the order.' });
  }
};

// Update order status

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    
    if (order.status === 'New') {
      order.status = 'Done';
      await order.save();
      console.log('Status updated from New to Done.');
    } else {
      console.log('Order status is not New. No update needed.');
    } const responseTime = order.getResponseTime(); // Calculate response time
    res.json({ order, responseTime });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the order.' });
  }
};


exports.getNewOrders = (req, res) => {
  Order.find({ status: 'New' })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.error('Error retrieving new orders:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
};
exports.getDoneOrders = (req, res) => {
  Order.find({ status: 'Done' })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.error('Error retrieving done orders:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
};




// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndRemove(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the order.' });
  }
};
