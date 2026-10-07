const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: String,
    trim: true,
    default: 'Standard'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1.'],
    default: 1
  }
}, {
  timestamps: true
});

// Ensure unique combination of session, product, and variant to prevent duplicate line items
CartItemSchema.index({ sessionId: 1, productId: 1, variant: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', CartItemSchema);