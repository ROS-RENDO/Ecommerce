/**
 * Order Socket Handler
 * Manages WebSocket connections for real-time order tracking
 */

let io = null;

// Store active order rooms
const orderRooms = new Map();

/**
 * Initialize Socket.IO for order tracking
 * @param {Server} socketIO - Socket.IO server instance
 */
function initializeOrderSocket(socketIO) {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log('📱 Client connected to order tracking:', socket.id);

    // Join specific order room
    socket.on('join-order', (orderId) => {
      if (!orderId) {
        console.error('❌ No orderId provided');
        return;
      }

      const roomName = `order-${orderId}`;
      socket.join(roomName);

      // Track active connections
      if (!orderRooms.has(orderId)) {
        orderRooms.set(orderId, new Set());
      }
      orderRooms.get(orderId).add(socket.id);

      console.log(`✅ Socket ${socket.id} joined ${roomName}`);
      console.log(`👥 Active watchers for order ${orderId}: ${orderRooms.get(orderId).size}`);

      // Send confirmation to client
      socket.emit('joined-order', {
        orderId,
        message: 'Successfully subscribed to order updates',
        timestamp: new Date()
      });
    });

    // Leave order room
    socket.on('leave-order', (orderId) => {
      if (!orderId) return;

      const roomName = `order-${orderId}`;
      socket.leave(roomName);

      // Remove from tracking
      if (orderRooms.has(orderId)) {
        orderRooms.get(orderId).delete(socket.id);
        if (orderRooms.get(orderId).size === 0) {
          orderRooms.delete(orderId);
        }
      }

      console.log(`👋 Socket ${socket.id} left ${roomName}`);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log('📴 Client disconnected:', socket.id);

      // Clean up from all order rooms
      orderRooms.forEach((sockets, orderId) => {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          orderRooms.delete(orderId);
          console.log(`🗑️ Removed empty room for order ${orderId}`);
        }
      });
    });

    // Optional: Ping/Pong for connection health check
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date() });
    });
  });

  console.log('✅ Order Socket.IO initialized');
}

/**
 * Emit order update to all clients watching a specific order
 * @param {string} orderId - The order ID
 * @param {object} orderData - The updated order data
 */
function emitOrderUpdate(orderId, orderData) {
  if (!io) {
    console.error('❌ Socket.IO not initialized');
    return;
  }

  const roomName = `order-${orderId}`;
  const watcherCount = orderRooms.get(orderId)?.size || 0;

  // Emit to all clients in the room
  io.to(roomName).emit('order-updated', {
    orderId,
    status: orderData.status,
    updatedAt: orderData.updatedAt || new Date(),
    order: orderData
  });

  console.log(`📤 Emitted update for order ${orderId} to ${watcherCount} clients`);
  console.log(`📊 Status: ${orderData.status}`);
}

/**
 * Get Socket.IO instance
 * @returns {Server} Socket.IO server instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeOrderSocket first.');
  }
  return io;
}

/**
 * Get active watcher count for an order
 * @param {string} orderId - The order ID
 * @returns {number} Number of active watchers
 */
function getWatcherCount(orderId) {
  return orderRooms.get(orderId)?.size || 0;
}

/**
 * Get all active order rooms
 * @returns {Map} Map of orderId to Set of socket IDs
 */
function getActiveRooms() {
  return orderRooms;
}

/**
 * Broadcast message to all connected clients (optional utility)
 * @param {string} event - Event name
 * @param {object} data - Data to broadcast
 */
function broadcastToAll(event, data) {
  if (!io) {
    console.error('❌ Socket.IO not initialized');
    return;
  }
  io.emit(event, data);
  console.log(`📢 Broadcasted ${event} to all clients`);
}

module.exports = {
  initializeOrderSocket,
  emitOrderUpdate,
  getIO,
  getWatcherCount,
  getActiveRooms,
  broadcastToAll
};