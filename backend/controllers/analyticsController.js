const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'customer' });
  
  // Include all orders except cancelled ones for revenue and graph
  const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
  const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  const salesData = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 7 }
  ]);

  res.json({
    totalOrders,
    totalUsers,
    totalRevenue,
    salesData
  });
});

module.exports = { getDashboardStats };