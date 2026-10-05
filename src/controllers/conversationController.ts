import { Request, Response, NextFunction } from 'express';
import { conversationRepository } from '../repositories/conversationRepository';
import { AppError } from '../middleware/errorHandler';

export class ConversationController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await conversationRepository.getAll();
      res.status(200).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const conversation = await conversationRepository.getById(id);
      if (!conversation) {
        throw new AppError(`Conversation with ID ${id} not found`, 404);
      }
      res.status(200).json({ success: true, data: conversation });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Send message endpoint — supports both customer and agent side.
   * This enables testing the full AI reply loop end-to-end interactively!
   */
  async reply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { message, sender = 'agent' } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        throw new AppError('Message content is required', 400);
      }

      const role: 'customer' | 'agent' = sender === 'customer' ? 'customer' : 'agent';
      const updated = await conversationRepository.addMessage(id, role, message.trim());

      if (!updated) {
        throw new AppError(`Conversation with ID ${id} not found`, 404);
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const conversationController = new ConversationController();
