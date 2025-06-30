import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    category: "Electronics",
    stock: 50,
    rating: 4.5,
    reviews: 128
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone connectivity. Track your health goals.",
    price: 299.99,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    category: "Electronics",
    stock: 30,
    rating: 4.3,
    reviews: 89
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes.",
    price: 29.99,
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    category: "Clothing",
    stock: 100,
    rating: 4.7,
    reviews: 245
  },
  {
    name: "Professional Camera Lens",
    description: "High-performance 50mm lens for professional photography. Compatible with most DSLR cameras.",
    price: 899.99,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
    category: "Electronics",
    stock: 15,
    rating: 4.8,
    reviews: 67
  },
  {
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 349.99,
    image: "https://images.pexels.com/photos/586996/pexels-photo-586996.jpeg",
    category: "Furniture",
    stock: 25,
    rating: 4.4,
    reviews: 156
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    image: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg",
    category: "Sports",
    stock: 75,
    rating: 4.6,
    reviews: 312
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek and modern design.",
    price: 39.99,
    image: "https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg",
    category: "Electronics",
    stock: 60,
    rating: 4.2,
    reviews: 98
  },
  {
    name: "Premium Yoga Mat",
    description: "Non-slip premium yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and meditation.",
    price: 79.99,
    image: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg",
    category: "Sports",
    stock: 40,
    rating: 4.5,
    reviews: 187
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs. Microwave and dishwasher safe. Perfect for coffee enthusiasts.",
    price: 49.99,
    image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
    category: "Home",
    stock: 35,
    rating: 4.3,
    reviews: 76
  },
  {
    name: "Bluetooth Portable Speaker",
    description: "Compact portable speaker with powerful sound and 12-hour battery life. Waterproof design for outdoor use.",
    price: 89.99,
    image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
    category: "Electronics",
    stock: 45,
    rating: 4.4,
    reviews: 134
  },
  {
    name: "Designer Sunglasses",
    description: "Stylish designer sunglasses with UV protection. Classic design that never goes out of style.",
    price: 159.99,
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg",
    category: "Accessories",
    stock: 20,
    rating: 4.6,
    reviews: 92
  },
  {
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand for better ergonomics. Compatible with laptops up to 17 inches.",
    price: 69.99,
    image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
    category: "Electronics",
    stock: 55,
    rating: 4.5,
    reviews: 203
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();
    console.log('Regular user created');

    // Create products
    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();