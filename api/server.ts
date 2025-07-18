import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import authRoutes from '../server/src/routes/auth';
import customerRoutes from '../server/src/routes/customers';
import dashboardRoutes from '../server/src/routes/dashboard';
import inventoryRoutes from '../server/src/routes/inventory';
import invoiceRoutes from '../server/src/routes/invoices';
import purchaseOrderRoutes from '../server/src/routes/purchaseOrders';
import receivingRoutes from '../server/src/routes/receiving';
import userRoutes from '../server/src/routes/users';
import vehicleRoutes from '../server/src/routes/vehicles';
import vendorRoutes from '../server/src/routes/vendors';
import warehouseRoutes from '../server/src/routes/warehouses';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/receiving', receivingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/warehouses', warehouseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default response for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
});

// Export the Express app as a Vercel serverless function
export default app; 