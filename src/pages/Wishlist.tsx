import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(res.data.wishlist);
    } catch (err) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await axios.post(
        `http://localhost:5000/api/wishlist/remove/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Please <Link to="/login" className="text-blue-600 underline">login</Link> to view your wishlist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Heart className="w-7 h-7 text-pink-600 fill-pink-600" />
          My Wishlist
        </h2>
        {wishlist.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your wishlist is empty.</p>
            <Link to="/products" className="text-blue-600 hover:underline">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <Link to={`/product/${product._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {product.name}
                  </Link>
                  <div className="text-gray-600">{product.category}</div>
                  <div className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="p-2 rounded hover:bg-red-100"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;