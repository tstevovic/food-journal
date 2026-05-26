import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  
  // Log error details
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    statusCode,
    code,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't expose internal error details in production
  const message = statusCode < 500 ? error.message : i18n.t('server.internal_error');

  res.status(statusCode).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
};

export const createError = (message: string, statusCode: number = 500, code?: string): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(i18n.t('server.not_found'), 404, 'NOT_FOUND');
  next(error);
};
