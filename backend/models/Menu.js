const mongoose = require('mongoose');

const menuSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [String],
    allergens: [String],
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['starters', 'mains', 'desserts', 'drinks', 'sides'],
    },
    image: { type: String, required: true }, // Cloudinary URL
    isAvailable: { type: Boolean, default: true },
    customizationOptions: [
      {
        name: String,
        options: [String],
        extraPrice: { type: Number, default: 0 },
      },
    ],
    spiceLevel: { type: String, enum: ['none', 'mild', 'medium', 'hot'], default: 'none' },
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', menuSchema);