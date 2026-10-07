const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'forgeai-admin-secret-change-me';

// Inline admin authorization middleware
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired administrator token' });
  }
};

// GET /api/reviews - GET ALL (PUBLIC)
// Optional query parameter: ?productId=XYZ
router.get('/', async (req, res, next) => {
  try {
    const { productId } = req.query;
    const filter = {};
    if (productId) {
      filter.productId = productId;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews/:id - GET SINGLE BY ID (PUBLIC)
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json(review);
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews - CREATE A NEW REVIEW (PUBLIC)
router.post('/', async (req, res, next) => {
  try {
    const { productId, reviewerName, rating, comment, verifiedBuyer } = req.body;

    if (!productId || !reviewerName || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields: productId, reviewerName, and rating are required.' });
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    const newReview = new Review({
      productId,
      reviewerName,
      rating: parsedRating,
      comment: comment || '',
      verifiedBuyer: verifiedBuyer === true || verifiedBuyer === 'true',
      createdAt: new Date()
    });

    const savedReview = await newReview.save();
    return res.status(201).json(savedReview);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// PUT /api/reviews/:id - UPDATE (ADMIN ONLY)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { reviewerName, rating, comment, verifiedBuyer, productId } = req.body;
    
    const updateData = {};
    if (productId !== undefined) updateData.productId = productId;
    if (reviewerName !== undefined) updateData.reviewerName = reviewerName;
    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
      }
      updateData.rating = parsedRating;
    }
    if (comment !== undefined) updateData.comment = comment;
    if (verifiedBuyer !== undefined) updateData.verifiedBuyer = (verifiedBuyer === true || verifiedBuyer === 'true');

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json(updatedReview);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// DELETE /api/reviews/:id - DELETE (ADMIN ONLY)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.json({ message: 'Review successfully deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;