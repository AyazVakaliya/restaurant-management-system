const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, itemId } = req.body;
  const review = new Review({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    item: itemId,
  });
  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).populate('user', 'name');
  res.json(reviews);
});

module.exports = { addReview, getReviews };