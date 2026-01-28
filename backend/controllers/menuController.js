const asyncHandler = require('express-async-handler');
const Menu = require('../models/Menu');

// @desc    Fetch all menu items
// @route   GET /api/menu
const getMenuItems = asyncHandler(async (req, res) => {
  const menu = await Menu.find({});
  res.json(menu);
});

// @desc    Fetch single menu item
// @route   GET /api/menu/:id
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, ingredients, allergens } = req.body;
  const item = new Menu({
    name,
    price,
    description,
    image,
    category,
    ingredients,
    allergens,
    user: req.user._id,
  });
  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, isAvailable, stock } = req.body;
  const item = await Menu.findById(req.params.id);
  if (item) {
    item.name = name || item.name;
    item.price = price || item.price;
    item.description = description || item.description;
    item.image = image || item.image;
    item.category = category || item.category;
    item.isAvailable = isAvailable !== undefined ? isAvailable : item.isAvailable;
    item.stock = stock !== undefined ? stock : item.stock;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (item) {
    await item.deleteOne();
    res.json({ message: 'Menu item removed' });
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };