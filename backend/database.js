
// import { MongoClient, ServerApiVersion } from "mongodb";
// const uri = "mongodb+srv://vaibhavchauhanrajput74321:S3xYfvCY3c19EAdf@cluster0.virxney.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


// database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.virxney.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas connected via Mongoose!');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
    throw error;
  }
};

connectDB();

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from Atlas');
});

export default mongoose;
