import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user's cart
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json({ cart: user.cart });
});

// Add/update product in cart
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);

  const cartItem = user.cart.find(item => item.product.toString() === productId);
  if (cartItem) {
    cartItem.quantity += quantity || 1;
  } else {
    user.cart.push({ product: productId, quantity: quantity || 1 });
  }
  await user.save();
  res.json({ cart: user.cart });
});

// Update quantity
router.put('/update', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);

  const cartItem = user.cart.find(item => item.product.toString() === productId);
  if (cartItem) {
    cartItem.quantity = quantity;
    if (cartItem.quantity <= 0) {
      user.cart = user.cart.filter(item => item.product.toString() !== productId);
    }
    await user.save();
  }
  res.json({ cart: user.cart });
});

// Remove from cart
router.post('/remove', protect, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(item => item.product.toString() !== productId);
  await user.save();
  res.json({ cart: user.cart });
});

// Clear cart
router.post('/clear', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ cart: user.cart });
});

export default router;