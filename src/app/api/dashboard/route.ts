import { NextResponse } from 'next/server';
import {
  caseTrendData,
  getDashboardSummary,
  getPipelineData,
  getStatusBreakdown,
  getTopClients,
  getUrgentCases,
  getUpcomingDeadlines,
  legalActivities,
} from '@/lib/legal-dashboard-data';

export async function GET() {
  return NextResponse.json({
    data: {
      summary: getDashboardSummary(),
      pipeline: getPipelineData(),
      statusBreakdown: getStatusBreakdown(),
      topClients: getTopClients(),
      urgentCases: getUrgentCases(),
      upcomingDeadlines: getUpcomingDeadlines(),
      activities: legalActivities,
      trend: caseTrendData,
    },
  });
}
