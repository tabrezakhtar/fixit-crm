import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardPage } from '../../components/Dashboard/DashboardPage';
import { DashboardShell } from '../../components/Dashboard/DashboardShell';
import { GUEST_SESSION_COOKIE, getGuestSessionUsername } from '../../lib/guest-session';

export default async function Dashboard() {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;
  const username = await getGuestSessionUsername(token);

  if (!username) redirect('/');

  return (
    <DashboardShell>
      <DashboardPage username={username} />
    </DashboardShell>
  );
}
