import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { TechniciansPage } from '../../../components/Dashboard/TechniciansPage';
import { getTechnicians } from '../../../lib/technicians';

export default async function Technicians() {
  const technicians = await getTechnicians();

  return (
    <DashboardShell>
      <TechniciansPage technicians={technicians} />
    </DashboardShell>
  );
}