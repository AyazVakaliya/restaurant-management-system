const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus, getMyOrders, getOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin', 'manager', 'kitchen'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorize('admin', 'manager', 'kitchen', 'delivery'), updateOrderStatus);

module.exports = router;