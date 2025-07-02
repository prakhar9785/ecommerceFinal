import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  total: { type: Number, required: true },
  paymentStatus: { type: String, default: 'paid' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);