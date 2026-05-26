import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';
import { AuthenticatedRequest } from '@/middleware/auth';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await this.authService.register(req.body);

      res.status(201).json({
        message: i18n.t('auth.user_created'),
        data: { user, token }
      });
    } catch (error: any) {
      logger.error('Register controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'REGISTER_ERROR'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await this.authService.login(req.body);

      res.json({
        message: i18n.t('auth.login_success'),
        data: { user, token }
      });
    } catch (error: any) {
      logger.error('Login controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'LOGIN_ERROR'
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      const user = await this.authService.getUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          error: i18n.t('auth.user_not_found'),
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        data: { user }
      });
    } catch (error: any) {
      logger.error('Get profile controller error', { error });
      res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'GET_PROFILE_ERROR'
      });
    }
  }
}
