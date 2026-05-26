import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { logger } from './logger';

export interface JwtPayload {
  userId: string;
  email: string;
}

export class JwtUtils {
  static generateToken(payload: JwtPayload): string {
    try {
      return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });
    } catch (error) {
      logger.error('Error generating JWT token', { error });
      throw new Error('Failed to generate token');
    }
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      logger.error('Error verifying JWT token', { error });
      throw new Error('Invalid token');
    }
  }

  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}
