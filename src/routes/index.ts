import { Router } from 'express';
import { authRoutes } from './auth';
import { foodJournalRoutes } from './foodJournal';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/food-journal', foodJournalRoutes);

export { router as apiRoutes };
