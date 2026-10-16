import { DashboardPage } from '../../components/Dashboard/DashboardPage';
import { DashboardShell } from '../../components/Dashboard/DashboardShell';

export default function Dashboard() {
  return (
    <DashboardShell>
      <DashboardPage username="guest" />
    </DashboardShell>
  );
}
