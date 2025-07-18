import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health') {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return;
  }

  // Test endpoint
  if (req.url === '/test') {
    res.status(200).json({
      message: 'API is working!',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Default response
  res.status(200).json({
    message: 'Integrator Pro API',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 