import { DashboardPage } from '../../components/Dashboard/DashboardPage';
import { DashboardShell } from '../../components/Dashboard/DashboardShell';
import { getDashboardData } from '../../lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const dashboardData = await getDashboardData();

  return (
    <DashboardShell>
      <DashboardPage {...dashboardData} />
    </DashboardShell>
  );
}
