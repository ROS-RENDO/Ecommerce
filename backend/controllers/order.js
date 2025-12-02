const Order = require("../models/Order")
const Cart = require("../models/Cart")
const { getIO, emitOrderUpdate } = require('../socket/ordersocket');


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { email, firstName, lastName, street, city, state, zipCode, country } = req.body;

    // Get user's cart with product info
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product "${item.product.name}" only has ${item.product.stock} in stock.`
        });
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images && item.product.images.length > 0
        ? item.product.images[0]
        : { public_id: "", url: "" }
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: { email, firstName, lastName, street, city, state, zipCode, country },
      shipping: { type: req.body.shippingType, cost: req.body.shippingcost },
      totalPrice,
    });

    await order.save();

    // Reduce stock for each product
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ user: userId })
            .populate("items.product", "name images price") // Changed to 'images' to match Product model
            .sort({ createdAt: -1 }); // Fixed typo: createAt -> createdAt
        res.json(orders);
    } catch (err) {
        console.error(err); // Fixed typo: console.err -> console.error
        res.status(500).json({ message: "Server error" })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate("items.product", "name images price"); // Changed to 'images'
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name images price") // Changed to 'images'
            .sort({ createdAt: -1 }); // Fixed typo: createAt -> createdAt
        res.json(orders)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// POST /api/orders/:id/payment
exports.addPayment= async(req, res)=>{
    try {
        const {id}= req.params;
        const {method, cardNumber, expiry, PayPalEmail,txHash}= req.body;
        const order= await Order.findById(id);
        if(!order){
            return res.status(404).json({message: "Order not found "});
        }
        order.payment= { method, cardNumber, expiry, PayPalEmail, txHash };
        order.payment.paymentstatus= "Processing";
        await order.save();
        res.json({order})
    
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"})
    }
}


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find and update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status, 
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    )
    .populate('items.product')
    .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // ⭐ EMIT WEBSOCKET EVENT TO ALL CLIENTS WATCHING THIS ORDER
    emitOrderUpdate(orderId, {
      _id: order._id,
      status: order.status,
      updatedAt: order.updatedAt,
      items: order.items,
      user: order.user,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod
    });

    // Log for debugging
    console.log(`📦 Order ${orderId} status updated to: ${status}`);

    // Return success response
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const now = new Date();

    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = currentMonthStart;

    // Orders in current and last month
    const currentMonthOrders = await Order.find({
      createdAt: { $gte: currentMonthStart, $lt: currentMonthEnd },
    });

    const lastMonthOrders = await Order.find({
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
    });

    // Helper to calculate total revenue, orders, customers, products
    const calcMetrics = (orders) => {
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const totalOrders = orders.length;
      const totalCustomers = new Set(orders.map(o => o.user.toString())).size;
      const totalProducts = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

      return { totalRevenue, totalOrders, totalCustomers, totalProducts };
    };

    const current = calcMetrics(currentMonthOrders);
    const last = calcMetrics(lastMonthOrders);

    // Helper to calculate % change
    const calcGrowth = (currentValue, lastValue) => {
      if (lastValue === 0) return currentValue === 0 ? 0 : 100;
      return ((currentValue - lastValue) / lastValue) * 100;
    };

    res.json({
      totalRevenue: current.totalRevenue,
      revenueGrowth: calcGrowth(current.totalRevenue, last.totalRevenue).toFixed(1),

      totalOrders: current.totalOrders,
      ordersGrowth: calcGrowth(current.totalOrders, last.totalOrders).toFixed(1),

      totalCustomers: current.totalCustomers,
      customersGrowth: calcGrowth(current.totalCustomers, last.totalCustomers).toFixed(1),

      totalProducts: current.totalProducts,
      productsGrowth: calcGrowth(current.totalProducts, last.totalProducts).toFixed(1),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getActiveWatchers = (req, res) => {
  try {
    const { orderId } = req.params;
    const io = getIO();
    
    // Get all sockets in the order room
    const room = io.sockets.adapter.rooms.get(`order-${orderId}`);
    const watcherCount = room ? room.size : 0;

    res.json({
      success: true,
      orderId,
      watcherCount,
      isActive: watcherCount > 0
    });

  } catch (error) {
    console.error('Error getting watchers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get watcher count',
      error: error.message
    });
  }
};
