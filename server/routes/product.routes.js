const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline Middleware to verify Admin JWT for mutation/deletion endpoints
function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Bearer token is missing.' });
    }

    jwt.verify(token, ADMIN_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired admin token.' });
      }
      // Ensure the decoded payload has admin privileges
      if (decoded && decoded.role === 'admin') {
        req.adminUser = decoded;
        next();
      } else {
        return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products - PUBLIC
// Supports optional filtering by category, skillLevel, and limit/skip for pagination
router.get('/', async (req, res, next) => {
  try {
    const { category, skillLevel, search, limit, skip } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (skillLevel) {
      filter.skillLevel = skillLevel;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const totalCount = await Product.countDocuments(filter);
    
    let query = Product.find(filter);

    if (skip) {
      query = query.skip(parseInt(skip, 10));
    }
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const products = await query.exec();

    res.json({
      products,
      totalCount,
      limit: limit ? parseInt(limit, 10) : products.length,
      skip: skip ? parseInt(skip, 10) : 0
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:idOrSlug - PUBLIC (Fetches by standard MongoDB ID or unique slug)
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const identifier = req.params.idOrSlug;
    let product;

    // Check if valid ObjectId first, otherwise find by unique slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - PUBLIC (Anyone can create - e.g., visitor preview creations, import utilities, or admin quick submissions)
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      slug,
      category,
      price,
      compareAtPrice,
      skillLevel,
      material,
      weight,
      bowType,
      colors,
      images,
      description
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Required fields: name, category, and price.' });
    }

    // Auto-generate clean slug if not explicitly provided
    const computedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Ensure slug uniqueness
    const existingProduct = await Product.findOne({ slug: computedSlug });
    if (existingProduct) {
      return res.status(400).json({ error: `A product with the slug '${computedSlug}' already exists.` });
    }

    const newProduct = new Product({
      name,
      slug: computedSlug,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      skillLevel,
      material,
      weight,
      bowType,
      colors,
      images,
      description
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/products/:id - requireAdmin only
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Format fields correctly if present
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.compareAtPrice !== undefined) {
      updateData.compareAtPrice = updateData.compareAtPrice ? Number(updateData.compareAtPrice) : null;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found to update.' });
    }

    res.json(updatedProduct);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/products/:id - requireAdmin only
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found to delete.' });
    }

    res.json({ message: 'Product successfully removed.', deletedProduct });
  } catch (err) {
    next(err);
  }
});

module.exports = router;