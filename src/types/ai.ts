import { KnowledgeItem, GuardrailCheck } from './conversation';

export interface SourceReference {
  id: string;
  title: string;
}

export interface AIAnalysis {
  suggestedReply: string;
  intent: string;
  sentiment: string;
  sources: SourceReference[];
  retrievedContext?: KnowledgeItem[];
  guardrail?: GuardrailCheck;
  alternativeReply?: string;
  confidence?: number;
}

export interface AIReplyRequest {
  conversationId: string;
  customerMessage?: string;
  tone?: string;
}

export interface AIAnalyzeRequest {
  message: string;
  brandId?: string;
}
