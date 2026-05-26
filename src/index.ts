import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from '@/config/database';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { i18n } from '@/utils/i18n';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { apiRoutes } from '@/routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database connection and start server
async function startServer(): Promise<void> {
  try {
    // Initialize database
    await AppDataSource.initialize();
    logger.info('Database connection established successfully');

    // Start server
    app.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`, {
        nodeEnv: config.nodeEnv,
        database: config.database.name
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }
  
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start the server
startServer();
