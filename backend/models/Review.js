const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);