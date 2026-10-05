import { conversationRepository } from '../repositories/conversationRepository';
import { Conversation, ConversationDetail } from '../types/conversation';
import { AppError } from '../middleware/errorHandler';

export class ConversationService {
  async getConversations(): Promise<Conversation[]> {
    return conversationRepository.getAll();
  }

  async getConversationById(id: string): Promise<ConversationDetail> {
    const conv = await conversationRepository.getById(id);
    if (!conv) {
      throw new AppError(`Conversation with ID ${id} not found`, 404);
    }
    return conv;
  }

  async replyToConversation(id: string, message: string): Promise<ConversationDetail> {
    if (!message || message.trim() === '') {
      throw new AppError('Reply message cannot be empty', 400);
    }
    const updated = await conversationRepository.addMessage(id, 'agent', message.trim());
    if (!updated) {
      throw new AppError(`Conversation with ID ${id} not found`, 404);
    }
    return updated;
  }
}

export const conversationService = new ConversationService();
