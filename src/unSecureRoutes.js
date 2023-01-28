import { Router } from 'express';
import authRoutes from './modules/auth/authRoutes.js';
import uploadRoutes from './modules/upload/uploadRoutes.js';
import eventRoutes from './modules/event/eventRoutes.js';

const router = Router();

// Link all modules here
router.use('/api/auth', authRoutes);
router.use('/api/upload', uploadRoutes);
router.use('/api/event', eventRoutes);

export default router;
