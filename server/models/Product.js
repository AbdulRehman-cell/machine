const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['Hockey Sticks', 'Match Kit', 'Paddle Rackets', 'Accessories']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: null
    },
    skillLevel: {
      type: String,
      trim: true,
      default: 'All Levels'
    },
    material: {
      type: String,
      trim: true,
      default: 'Composite'
    },
    weight: {
      type: String,
      trim: true,
      default: 'Light'
    },
    bowType: {
      type: String,
      trim: true,
      default: 'Standard'
    },
    colors: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      required: true,
      default: ['https://picsum.photos/seed/product/600/600']
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure slug is always lowercase and clean
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;