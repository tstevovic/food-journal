import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { validateRequest } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { createUserSchema, loginUserSchema } from '@/types/validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRequest(createUserSchema), authController.register);
router.post('/login', validateRequest(loginUserSchema), authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

export { router as authRoutes };
