import { Request, Response, NextFunction } from 'express';
import { JwtUtils, JwtPayload } from '@/utils/jwt';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        error: i18n.t('auth.token_required'),
        code: 'TOKEN_REQUIRED'
      });
      return;
    }

    const payload = JwtUtils.verifyToken(token);
    req.user = payload;
    
    logger.debug('User authenticated successfully', { userId: payload.userId });
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    res.status(401).json({
      error: i18n.t('auth.invalid_token'),
      code: 'INVALID_TOKEN'
    });
  }
};
