import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // For now, let's create a simple admin user check
    // In production, this would connect to your database
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin-user-id' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      const user = {
        id: 'admin-user-id',
        username: 'admin',
        email: 'admin@integratorpro.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true
      };

      res.json({
        success: true,
        data: {
          user,
          token
        },
        message: 'Login successful'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

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