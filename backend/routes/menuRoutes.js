const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, deleteAllMenuItems } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('admin', 'manager'), createMenuItem)
  .delete(protect, authorize('admin', 'manager'), deleteAllMenuItems);
router.route('/:id').get(getMenuItemById).put(protect, authorize('admin', 'manager'), updateMenuItem).delete(protect, authorize('admin', 'manager'), deleteMenuItem);

module.exports = router;