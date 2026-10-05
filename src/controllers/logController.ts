import { Request, Response, NextFunction } from 'express';
import { interactionLogRepository } from '../repositories/interactionLogRepository';

export class LogController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conversationId } = req.query;
      const logs = await interactionLogRepository.getLogs(conversationId as string | undefined);
      res.status(200).json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conversationId, brandId, customerMessage, retrievedContext, aiGeneratedReply, agentEditedReply, finalResponse } = req.body;
      const log = await interactionLogRepository.logInteraction({
        conversationId,
        brandId,
        customerMessage,
        retrievedContext,
        aiGeneratedReply,
        agentEditedReply,
        finalResponse
      });
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }
}

export const logController = new LogController();
