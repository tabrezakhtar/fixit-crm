import { Suspense, type ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Center, Loader } from '@mantine/core';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../lib/guest-session';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <Center mih="100vh">
          <Loader size="sm" aria-label="Loading dashboard" />
        </Center>
      }
    >
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}

async function AuthenticatedDashboard({ children }: { children: ReactNode }) {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;

  if (!(await verifyGuestSession(token))) {
    redirect('/');
  }

  return children;
}
