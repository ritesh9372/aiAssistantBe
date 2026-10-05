import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function validateGenerateReply(req: Request, _res: Response, next: NextFunction): void {
  const { conversationId } = req.body;
  if (!conversationId || typeof conversationId !== 'string') {
    return next(new AppError('Missing or invalid conversationId', 400));
  }
  // Default tone if not provided
  if (!req.body.tone || typeof req.body.tone !== 'string') {
    req.body.tone = 'Professional';
  }
  next();
}

export function validateAnalyzeMessage(req: Request, _res: Response, next: NextFunction): void {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return next(new AppError('Missing or invalid message', 400));
  }
  next();
}
