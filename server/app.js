import express from 'express';
import mongoose from 'mongoose';
import connectDB from './database/connection.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRouter.js';
import catogryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js'
import path from "path";
import { fileURLToPath } from "url";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));




//  CONFIGURATION --->

// Load environment variables from config file
dotenv.config({ path: './config.env' });

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// ROUTES --->

// Authentication routes 
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', catogryRoutes);
app.use('/api/v1/products', productRoutes);




//  SERVER LISTENING --->
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



