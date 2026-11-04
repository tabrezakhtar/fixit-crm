import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { ReportsPage } from '../../../components/Dashboard/ReportsPage';
import { getReports } from '../../../lib/reports';

export default async function Reports() {
  const reports = await getReports();

  return (
    <DashboardShell>
      <ReportsPage reports={reports} />
    </DashboardShell>
  );
}