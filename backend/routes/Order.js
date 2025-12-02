const {protect, adminOnly} = require("../middleware/auth.js")
const {createOrder, updateOrderStatus, getUserOrders, getOrderById, getAllOrders, getOrderStats, addPayment, getActiveWatchers}= require("../controllers/order.js")

const express= require("express")
const router= express.Router();

router.get("/stats", protect, adminOnly, getOrderStats)// admin

router.post("/:id/payment", protect, addPayment)

router.post("/checkout", protect, createOrder)

router.get('/:orderId/watchers', getActiveWatchers);

// customer
router.get("/my-orders", protect, getUserOrders)
router.get("/:orderId", protect, getOrderById)

// admin
router.get("/", protect , adminOnly, getAllOrders)
router.patch("/:orderId/status", protect ,adminOnly, updateOrderStatus)

module.exports= router;