import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {




  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();




const { user } = useAuth();

const handlePlaceOrder = async () => {
  if (!user) {
    toast.error('Please login to place order');
    return;
  }

  // 1. Check stock for each product
  try {
    for (const item of items) {
      const res = await fetch(`http://localhost:5000/api/products/${item.productId}`);
      const product = await res.json();
      if (item.quantity > product.stock) {
        toast.error(`Not enough stock for "${item.name}". Only ${product.stock} left.`);
        return;
      }
    }

    // 2. Place order
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: getTotalPrice(),
      }),
    });

    if (res.ok) {
      // 3. Lower product stock (handled in backend, see below)
      clearCart();
      // 4. Redirect to thank you page
      window.location.href = '/thankyou';
    } else {
      toast.error('Failed to place order');
    }
  } catch {
    toast.error('Failed to place order');
  }
};



  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium"
                >
                  Continue Shopping
                </Link>
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"   onClick={handlePlaceOrder}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;