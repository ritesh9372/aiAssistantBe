import { KnowledgeItem } from '../types/conversation';
import { knowledgeBaseRepository } from '../repositories/knowledgeBaseRepository';

export interface RetrievedSource {
  id: string;
  title: string;
  content: string;
  category: string;
  relevanceScore: number;
}

export interface RetrievalResult {
  articles: KnowledgeItem[];
  sources: Array<{ id: string; title: string }>;
  topMatchSnippet: string;
}

const STOP_WORDS = new Set([
  'can', 'you', 'give', 'the', 'and', 'for', 'are', 'with', 'have', 'has', 'this',
  'that', 'from', 'what', 'where', 'when', 'how', 'your', 'our', 'more', 'get', 'not',
  'but', 'all', 'any', 'about', 'some', 'please', 'tell', 'know', 'like', 'want'
]);

/**
 * Reusable Knowledge Base Retrieval Service (RAG Pipeline - Step 1).
 *
 * Current implementation: Keyword & token relevance matching with domain category boost
 * and stop-word filtering.
 *
 * Architecture Note: This service is decoupled from the LLM and database layers.
 * It can be seamlessly replaced with:
 * - OpenAI / Cohere embeddings
 * - Vector databases (Qdrant, Pinecone, Weaviate, pgvector)
 * - Hybrid BM25 + dense semantic search
 * without changing any controllers, routes, or frontend code.
 */
export class RetrievalService {
  /**
   * Given a customer message, retrieve the most relevant Knowledge Base articles.
   *
   * @param customerMessage The raw inquiry from the customer
   * @param brandId Optional tenant/brand identifier for multi-brand isolation
   * @param limit Maximum number of articles to retrieve (default: 3)
   */
  async retrieveRelevantKnowledge(
    customerMessage: string,
    brandId?: string,
    limit: number = 3
  ): Promise<RetrievalResult> {
    if (!customerMessage || customerMessage.trim() === '') {
      return { articles: [], sources: [], topMatchSnippet: '' };
    }

    // Fetch all available articles (optionally filtered by brand/tenant)
    const allArticles = await knowledgeBaseRepository.getAll(brandId);
    const query = customerMessage.toLowerCase();
    const queryTokens = query
      .split(/[^a-zA-Z0-9]+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

    // Compute relevance scores
    const scoredArticles: Array<{ article: KnowledgeItem; score: number }> = allArticles.map((article) => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const contentLower = article.content.toLowerCase();

      // 1. Exact phrase matching
      if (contentLower.includes(query) || titleLower.includes(query)) {
        score += 20;
      }

      // 2. Token overlap (excluding stop words)
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 5;
        if (contentLower.includes(token)) score += 2;
      }

      // 3. Domain intent keyword scoring
      if ((query.includes('refund') || query.includes('money back') || query.includes('days ago') || query.includes('charge')) && article.category === 'refund') {
        score += 15;
      }
      if ((query.includes('return') || query.includes('exchange') || query.includes('send back')) && article.category === 'return') {
        score += 12;
      }
      if ((query.includes('ship') || query.includes('deliver') || query.includes('tracking') || query.includes('arrive')) && article.category === 'shipping') {
        score += 12;
      }
      if ((query.includes('cancel') || query.includes('stop order')) && article.category === 'cancellation') {
        score += 12;
      }
      if ((query.includes('premium') || query.includes('vip') || query.includes('priority')) && article.title.toLowerCase().includes('premium')) {
        score += 12;
      }
      if ((query.includes('broken') || query.includes('damaged') || query.includes('leak') || query.includes('bottle')) && article.category === 'refund') {
        score += 10;
      }

      return { article, score };
    });

    // Enforce a strict minimum relevance score threshold (6) to filter out spurious queries
    const relevant = scoredArticles
      .filter((item) => item.score >= 6)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.article);

    // Build structured sources for frontend and prompt context
    const sources = relevant.map((a) => ({
      id: a.id,
      title: a.title
    }));

    const topMatchSnippet = relevant.length > 0 ? relevant[0].content : '';

    return {
      articles: relevant,
      sources,
      topMatchSnippet
    };
  }
}

export const retrievalService = new RetrievalService();
