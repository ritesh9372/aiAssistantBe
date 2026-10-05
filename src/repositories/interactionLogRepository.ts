import { InteractionLog, KnowledgeItem } from '../types/conversation';

class InteractionLogRepository {
  private logs: InteractionLog[] = [];

  async logInteraction(data: {
    conversationId: string;
    brandId: string;
    customerMessage: string;
    retrievedContext: KnowledgeItem[];
    aiGeneratedReply: string;
    agentEditedReply: string;
    finalResponse: string;
  }): Promise<InteractionLog> {
    const newLog: InteractionLog = {
      ...data,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  async getLogs(conversationId?: string): Promise<InteractionLog[]> {
    if (conversationId) {
      return this.logs.filter((l) => l.conversationId === conversationId);
    }
    return this.logs;
  }
}

export const interactionLogRepository = new InteractionLogRepository();
