import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../lib/guest-session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;

  if (!(await verifyGuestSession(token))) {
    redirect('/');
  }

  return children;
}