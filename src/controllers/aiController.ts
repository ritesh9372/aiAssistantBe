import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';
import { conversationRepository } from '../repositories/conversationRepository';
import { AppError } from '../middleware/errorHandler';

export class AIController {
  async generateReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conversationId, customerMessage, tone = 'Professional' } = req.body;
      console.log('conversationId===>>>', conversationId)
      console.log('customerMessage===>>>', customerMessage)
      const conversation = await conversationRepository.getById(conversationId);

      if (!conversation) {
        throw new AppError(`Conversation ${conversationId} not found`, 404);
      }

      // Determine the customer message to respond to
      let queryMessage = customerMessage;
      if (!queryMessage || typeof queryMessage !== 'string' || queryMessage.trim() === '') {
        const customerMessages = conversation.messages.filter((m) => m.sender === 'customer');
        queryMessage = customerMessages[customerMessages.length - 1]?.message || conversation.lastMessage;
      }

      if (!queryMessage || queryMessage.trim() === '') {
        throw new AppError('No customer message found to generate reply for', 400);
      }

      // Generate reply through RAG pipeline: Knowledge Retrieval -> Context -> LLM Prompt -> Guardrails
      const analysis = await aiService.generateReply(queryMessage.trim(), conversation.brandId, tone);

      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (err) {
      next(err);
    }
  }

  async analyzeMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, brandId = 'brand-core', tone = 'Professional' } = req.body;
      if (!message || typeof message !== 'string') {
        throw new AppError('Message is required for analysis', 400);
      }
      const analysis = await aiService.generateReply(message, brandId, tone);
      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AIController();
