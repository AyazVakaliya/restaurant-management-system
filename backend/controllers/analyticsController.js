const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'customer' });
  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  // Sales by category/day could be expanded here
  const salesData = await Order.aggregate([
    { $match: { isPaid: true } },
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