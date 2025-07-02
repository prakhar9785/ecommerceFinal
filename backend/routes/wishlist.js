import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// Add to wishlist
router.post('/add/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
  res.json({ wishlist: user.wishlist });
});

// Remove from wishlist
router.post('/remove/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== req.params.productId
  );
  await user.save();
  res.json({ wishlist: user.wishlist });
});

// Get user's wishlist (populated)
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ wishlist: user.wishlist });
});

export default router;