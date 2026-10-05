import { dashboardRepository, DashboardStatsData } from '../repositories/dashboardRepository';

export class DashboardService {
  async getDashboardStats(): Promise<DashboardStatsData> {
    return dashboardRepository.getStats();
  }
}

export const dashboardService = new DashboardService();
