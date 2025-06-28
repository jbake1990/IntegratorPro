import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Invoice routes - Coming soon!' });
});

export default router; 