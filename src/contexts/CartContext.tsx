// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import toast from 'react-hot-toast';
// import { useAuth } from './AuthContext';
// import axios from 'axios';

// interface CartItem {
//   productId: string;
//   name: string;
//   price: number;
//   image: string;
//   quantity: number;
// }

// interface CartContextType {
//   items: CartItem[];
//   addToCart: (product: Omit<CartItem, 'quantity'>) => void;
//   removeFromCart: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalPrice: () => number;
//   getTotalItems: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// interface CartProviderProps {
//   children: ReactNode;
// }

// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const { user } = useAuth();

//     useEffect(() => {
//     if (user) {
//       // Fetch cart from backend
//       axios.get('http://localhost:5000/api/cart', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       }).then(res => {
//         setItems(res.data.cart.map((item: any) => ({
//           productId: item.product._id,
//           name: item.product.name,
//           price: item.product.price,
//           image: item.product.image,
//           quantity: item.quantity,
//         })));
//       });
//     } else {
//       setItems([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(items));
//   }, [items]);

//   const addToCart = (product: Omit<CartItem, 'quantity'>) => {
//     setItems(prevItems => {
//       const existingItem = prevItems.find(item => item.productId === product.productId);
      
//       if (existingItem) {
//         toast.success('Quantity updated in cart');
//         return prevItems.map(item =>
//           item.productId === product.productId
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         toast.success('Product added to cart');
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setItems(prevItems => prevItems.filter(item => item.productId !== productId));
//     toast.success('Product removed from cart');
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     setItems(prevItems =>
//       prevItems.map(item =>
//         item.productId === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setItems([]);
//     toast.success('Cart cleared');
//   };

//   const getTotalPrice = () => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getTotalItems = () => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   const value = {
//     items,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getTotalPrice,
//     getTotalItems,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await axios.get('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setItems(res.data.cart.map((item: any) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          })));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    };
    fetchCart();
  }, [user]);

  // Add to cart (backend)
  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId: product.productId,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refetch cart
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(res.data.cart.map((item: any) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      })));
      toast.success('Product added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  // Remove from cart (backend)
  const removeFromCart = async (productId: string) => {
    if (!user) return;
    try {
      await axios.post('http://localhost:5000/api/cart/remove', { productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(prev => prev.filter(item => item.productId !== productId));
      toast.success('Product removed from cart');
    } catch {
      toast.error('Failed to remove from cart');
    }
  };

  // Update quantity (backend)
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      await axios.put('http://localhost:5000/api/cart/update', { productId, quantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  // Clear cart (backend)
  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.post('http://localhost:5000/api/cart/clear', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems([]);
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};