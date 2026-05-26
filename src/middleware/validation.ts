import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';

export const validateRequest = (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const validatedData = schema.parse(data);
      
      // Replace the request data with validated data
      req[target] = validatedData;
      
      logger.debug('Request validation successful', { target });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => {
          const message = i18n.t(err.message);
          return {
            field: err.path.join('.'),
            message,
            code: err.code
          };
        });

        logger.warn('Request validation failed', { errors: errorMessages });
        
        res.status(400).json({
          error: i18n.t('validation.required_field'),
          code: 'VALIDATION_ERROR',
          details: errorMessages
        });
      } else {
        logger.error('Unexpected validation error', { error });
        res.status(500).json({
          error: i18n.t('server.internal_error'),
          code: 'INTERNAL_ERROR'
        });
      }
    }
  };
};
