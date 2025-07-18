import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from '../../server/src/routes/auth';
import inventoryRoutes from '../../server/src/routes/inventory';
import invoiceRoutes from '../../server/src/routes/invoices';
import purchaseOrderRoutes from '../../server/src/routes/purchaseOrders';
import receivingRoutes from '../../server/src/routes/receiving';
import customerRoutes from '../../server/src/routes/customers';
import vendorRoutes from '../../server/src/routes/vendors';
import vehicleRoutes from '../../server/src/routes/vehicles';
import warehouseRoutes from '../../server/src/routes/warehouses';
import userRoutes from '../../server/src/routes/users';
import dashboardRoutes from '../../server/src/routes/dashboard';

// Import middleware
import { errorHandler } from '../../server/src/middleware/errorHandler';
import { authMiddleware } from '../../server/src/middleware/auth';

// Load environment variables
dotenv.config();

const app = express();

// Initialize Prisma
export const prisma = new PrismaClient();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/inventory', authMiddleware, inventoryRoutes);
app.use('/invoices', authMiddleware, invoiceRoutes);
app.use('/purchase-orders', authMiddleware, purchaseOrderRoutes);
app.use('/receiving', authMiddleware, receivingRoutes);
app.use('/customers', authMiddleware, customerRoutes);
app.use('/vendors', authMiddleware, vendorRoutes);
app.use('/vehicles', authMiddleware, vehicleRoutes);
app.use('/warehouses', authMiddleware, warehouseRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/dashboard', authMiddleware, dashboardRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Vercel serverless function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
} 