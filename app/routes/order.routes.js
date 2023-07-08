module.exports = app => {
  const order = require("../controllers/order.controllers.js");

  var router = require("express").Router();



  // Create a new order
  router.post('/', order.createOrder);

  // Get all orders
  router.get('/getorders', order.getOrders);
  router.get('/get/new', order.getNewOrders);
  router.get('/get/done', order.getDoneOrders);

  // Get a single order by ID
  router.get('/:id', order.getOrderById);

  // Update an order
  router.put('/:id', order.updateOrder);

  // Update order status
  router.get('/updateOrderStatus/:id', order.updateOrderStatus);

// Get orders with status "New"


  // Delete an order
  router.delete('/deleteOrderbyid/:id', order.deleteOrder);

  app.use('/api/orders', router);


};



