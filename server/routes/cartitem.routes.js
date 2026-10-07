const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline requireAdmin middleware
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1] || authHeader;
    if (!token) {
      return res.status(401).json({ error: 'Token missing from authorization header' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired administrator token' });
      }
      // Attach admin info to request
      req.admin = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cartitems
 * PUBLIC: List all cart items, optionally filtered by sessionId to support persistent client shopping carts.
 */
router.get('/', async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const filter = {};
    if (sessionId) {
      filter.sessionId = sessionId;
    }
    const items = await CartItem.find(filter);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/cartitems/:id
 * PUBLIC: Retrieve a single cart item details.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/cartitems
 * PUBLIC: Anyone can add an item to the cart or update quantity if it already exists for the current session.
 */
router.post('/', async (req, res, next) => {
  try {
    const { sessionId, productId, variant, quantity } = req.body;

    if (!sessionId || !productId) {
      return res.status(400).json({ error: 'Missing sessionId or productId' });
    }

    // Check if item already exists in the cart for this session and variant
    let existingItem = await CartItem.findOne({
      sessionId,
      productId,
      variant: variant || ''
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
      const updatedItem = await existingItem.save();
      return res.status(200).json(updatedItem);
    } else {
      const newItem = new CartItem({
        sessionId,
        productId,
        variant: variant || '',
        quantity: Number(quantity) || 1
      });
      const savedItem = await newItem.save();
      return res.status(201).json(savedItem);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * PUT /api/cartitems/:id
 * ADMIN ONLY: Update cart item details (e.g., admin checkout override or session maintenance).
 * Note: To allow public cart updates, the client updates the whole cart state or creates a specific route.
 * According to strict rules, POST is public, PUT/DELETE are Admin Only.
 */
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { sessionId, productId, variant, quantity } = req.body;
    
    const item = await CartItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (sessionId !== undefined) item.sessionId = sessionId;
    if (productId !== undefined) item.productId = productId;
    if (variant !== undefined) item.variant = variant;
    if (quantity !== undefined) item.quantity = Number(quantity);

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * DELETE /api/cartitems/:id
 * ADMIN ONLY: Delete an item from the cart.
 */
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Cart item deleted successfully', deletedItem });
  } catch (err) {
    next(err);
  }
});

module.exports = router;