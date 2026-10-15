import { AppointmentsPage } from '../../../components/Dashboard/AppointmentsPage';
import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { getAppointments } from '../../../lib/appointments';

export default async function Appointments() {
  const events = await getAppointments();

  return (
    <DashboardShell>
      <AppointmentsPage events={events} />
    </DashboardShell>
  );
}
