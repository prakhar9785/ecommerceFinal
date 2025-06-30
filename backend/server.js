import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📍 Connection URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('🚨 MongoDB server is not running or not accessible');
      console.log('\n📋 SOLUTIONS:');
      console.log('   Option 1 - Start Local MongoDB:');
      console.log('   • Open a new terminal');
      console.log('   • Run: mongod');
      console.log('   • Keep it running while using the app');
      console.log('\n   Option 2 - Use MongoDB Atlas (Recommended):');
      console.log('   • Go to https://cloud.mongodb.com');
      console.log('   • Create a free cluster');
      console.log('   • Get your connection string');
      console.log('   • Update MONGODB_URI in backend/.env');
      console.log('\n   Option 3 - Install MongoDB locally:');
      console.log('   • Visit: https://www.mongodb.com/try/download/community');
      console.log('   • Download and install MongoDB');
      console.log('   • Start the service');
    } else {
      console.log('🔍 Connection issue details:', error.message);
      console.log('   • Check your MONGODB_URI in backend/.env');
      console.log('   • Verify network connectivity');
      console.log('   • Ensure MongoDB service is running');
    }
    
    console.log('\n⚠️  Server will continue running without database');
    console.log('   Some features may not work until database is connected');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
};

// Start server regardless of database connection
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 API available at: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    
    if (mongoose.connection.readyState !== 1) {
      console.log('\n⚠️  Note: Database not connected - some features may be limited');
    }
  });
};

// Initialize database connection and start server
connectDB();
startServer();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📴 MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});