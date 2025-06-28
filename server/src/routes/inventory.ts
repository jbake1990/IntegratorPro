import express from 'express';

const router = express.Router();

// TODO: Implement inventory routes
router.get('/', (req, res) => {
  res.json({ message: 'Inventory routes - Coming soon!' });
});

export default router; 