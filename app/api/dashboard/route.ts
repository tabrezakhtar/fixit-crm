import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDashboardData } from '../../../lib/dashboard';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../../lib/guest-session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = (await cookies()).get(GUEST_SESSION_COOKIE)?.value;
  if (!(await verifyGuestSession(token))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    return NextResponse.json(await getDashboardData());
  } catch (error) {
    console.error('Dashboard data request failed:', error);
    return NextResponse.json({ error: 'Unable to load dashboard data.' }, { status: 500 });
  }
}