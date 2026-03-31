import Layout from '@/components/layout/main-layout';
import DashboardCharts from '@/components/dashboard/charts';
import WorkspaceOverview from '@/components/dashboard/workspace-overview';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6 text-right">
        <WorkspaceOverview />
        <DashboardCharts />
      </div>
    </Layout>
  );
}
