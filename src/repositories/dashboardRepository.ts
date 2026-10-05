export interface DashboardStatsData {
  totalConversations: number;
  pendingConversations: number;
  resolvedConversations: number;
  aiSuggestedReplies: number;
}

export interface IDashboardRepository {
  getStats(): Promise<DashboardStatsData>;
}

class DashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStatsData> {
    return {
      totalConversations: 128,
      pendingConversations: 25,
      resolvedConversations: 84,
      aiSuggestedReplies: 96
    };
  }
}

export const dashboardRepository = new DashboardRepository();
