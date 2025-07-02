import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import Product from '../models/Product.js';
const router = express.Router();

// Place a new order (user)
router.post('/', protect, async (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  // Check and update stock for each product
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (item.quantity > product.stock) {
      return res.status(400).json({ message: `Not enough stock for ${product.name}` });
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    paymentStatus: 'paid', // or 'pending' if you want
  });
  res.status(201).json(order);
});



// Get all orders (admin)
router.get('/', protect, async (req, res) => {
  // Optionally add admin check here
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.product', 'name');
  res.json(orders);
});




// Get my orders (user)
router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name');
  res.json(orders);
});

export default router;