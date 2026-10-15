import { RepairJobsPage } from '../../../components/Dashboard/RepairJobsPage';
import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { getRepairJobs } from '../../../lib/repair-jobs';

export default async function RepairJobs() {
  const jobs = await getRepairJobs();

  return (
    <DashboardShell>
      <RepairJobsPage jobs={jobs} />
    </DashboardShell>
  );
}