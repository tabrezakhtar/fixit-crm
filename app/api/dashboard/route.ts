import { NextResponse } from 'next/server';
import { getDashboardData } from '../../../lib/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getDashboardData());
  } catch (error) {
    console.error('Dashboard data request failed:', error);
    return NextResponse.json({ error: 'Unable to load dashboard data.' }, { status: 500 });
  }
}