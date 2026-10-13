import { RepairJobsPage } from '../../../components/Dashboard/RepairJobsPage';
import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { getRepairJobs } from '../../../lib/repair-jobs';

export const dynamic = 'force-dynamic';

export default async function RepairJobs() {
  const jobs = await getRepairJobs();

  return (
    <DashboardShell>
      <RepairJobsPage jobs={jobs} />
    </DashboardShell>
  );
}