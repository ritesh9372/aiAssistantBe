import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, AppError } from './middleware/errorHandler';
import dashboardRoutes from './routes/dashboardRoutes';
import conversationRoutes from './routes/conversationRoutes';
import aiRoutes from './routes/aiRoutes';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes';
import logRoutes from './routes/logRoutes';

export function createApp(): Application {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true
    })
  );

  // Body parser
  app.use(express.json());

  // Request logger
  app.use(requestLogger);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        service: 'Datastraw AI-Powered CX Reply Assistant BE',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mockMode: ENV.AI_MOCK_MODE
      }
    });
  });

  // REST API Routes
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/kb', knowledgeBaseRoutes);
  app.use('/api/knowledge-base', knowledgeBaseRoutes);
  app.use('/api/logs', logRoutes);

  // 404 Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint ${req.method} ${req.originalUrl} not found`, 404));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
