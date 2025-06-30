# Full-Stack E-Commerce Website

A modern, responsive e-commerce website built with React, Node.js, Express, and MongoDB.

## Features

### Frontend
- **Modern React App** with TypeScript and Vite
- **Responsive Design** with Tailwind CSS
- **User Authentication** (Login/Register)
- **Product Catalog** with search and filtering
- **Shopping Cart** functionality
- **User Profile** management
- **Admin Dashboard** for product management
- **Beautiful UI** with smooth animations and transitions

### Backend
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** for secure user sessions
- **Role-based Access Control** (User/Admin)
- **Input Validation** and error handling
- **CORS** enabled for cross-origin requests

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React Hook Form for form handling
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (see setup options below)
- Git

### MongoDB Setup Options

**Option 1: MongoDB Atlas (Recommended - Free & Easy)**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

**Option 2: Local MongoDB Installation**
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install and start the MongoDB service
3. Use default connection: `mongodb://localhost:27017/ecommerce`

**Option 3: Docker (Advanced)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-fullstack
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   # For MongoDB Atlas (recommended):
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   
   # For local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/ecommerce
   
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
   NODE_ENV=development
   ```

4. **Start MongoDB (if using local installation)**
   
   **Windows:**
   ```bash
   # Start MongoDB service
   net start MongoDB
   # Or run directly:
   mongod
   ```
   
   **macOS:**
   ```bash
   # Using Homebrew:
   brew services start mongodb-community
   # Or run directly:
   mongod --config /usr/local/etc/mongod.conf
   ```
   
   **Linux:**
   ```bash
   # Using systemd:
   sudo systemctl start mongod
   # Or run directly:
   mongod
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   
   **Expected output when MongoDB is connected:**
   ```
   🔄 Attempting to connect to MongoDB...
   ✅ Connected to MongoDB successfully!
   🚀 Server is running on port 5000
   ```
   
   **If you see connection errors:**
   - The server will still start but with limited functionality
   - Follow the troubleshooting steps shown in the terminal
   - Database features won't work until MongoDB is properly connected

6. **Seed the database with sample data** (only after MongoDB is connected)
   ```bash
   cd backend
   node seedData.js
   ```

7. **Start the frontend development server**
   
   In a new terminal:
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## Troubleshooting MongoDB Connection

### Common Error: `ECONNREFUSED 127.0.0.1:27017`

This means MongoDB is not running. Here's how to fix it:

**Quick Fix:**
1. Open a new terminal
2. Run `mongod` (keep this terminal open)
3. Restart your backend server

**Permanent Solutions:**

**For MongoDB Atlas:**
1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Add your IP to whitelist (or use 0.0.0.0/0 for development)
4. Create database user
5. Get connection string and update `MONGODB_URI` in `.env`

**For Local MongoDB:**
1. Install MongoDB Community Server
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Checking Connection Status

Visit http://localhost:5000/api/health to see database connection status:
```json
{
  "status": "OK",
  "database": "Connected", // or "Disconnected"
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Project Structure

```
ecommerce-fullstack/
├── src/                          # Frontend React app
│   ├── components/              # Reusable components
│   │   ├── auth/               # Authentication components
│   │   ├── layout/             # Layout components (Header, Footer)
│   │   └── products/           # Product-related components
│   ├── contexts/               # React contexts (Auth, Cart)
│   ├── pages/                  # Page components
│   └── App.tsx                 # Main App component
├── backend/                     # Backend Node.js app
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── seedData.js            # Database seeding script
│   └── server.js              # Express server
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Features in Detail

### User Authentication
- Secure registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users

### Product Management
- CRUD operations for products
- Image upload support
- Category-based filtering
- Search functionality
- Stock management

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart (localStorage)
- Real-time total calculation

### Admin Dashboard
- Product management interface
- User management
- Sales analytics (coming soon)
- Order management (coming soon)

## Deployment

### Frontend Deployment (WebEyeSoft/cPanel)
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Upload the `dist/` folder contents to `public_html/`
3. Create `.htaccess` file for React Router support

### Backend Deployment
1. **WebEyeSoft (if Node.js supported)**:
   - Upload backend files
   - Install dependencies
   - Set environment variables
   - Start the server

2. **Alternative hosting** (Railway/Render):
   - Deploy backend to Railway or Render
   - Update frontend API URLs to point to deployed backend

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.