import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Purchase Order routes - Coming soon!' });
});

export default router; 