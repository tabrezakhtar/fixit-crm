/** @jest-environment node */

import { cookies } from 'next/headers';
import { getDashboardData } from '../../../lib/dashboard';
import { GUEST_SESSION_COOKIE, verifyGuestSession } from '../../../lib/guest-session';
import { GET } from './route';

jest.mock('next/headers', () => ({ cookies: jest.fn() }));
jest.mock('../../../lib/dashboard', () => ({ getDashboardData: jest.fn() }));
jest.mock('../../../lib/guest-session', () => ({
  GUEST_SESSION_COOKIE: 'fixitcrm_session',
  verifyGuestSession: jest.fn(),
}));

const mockCookieGet = jest.fn();

describe('GET /api/dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieGet.mockReturnValue({ value: 'session-token' });
    jest.mocked(cookies).mockResolvedValue({
      get: mockCookieGet,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  it('returns 401 when the guest session is invalid', async () => {
    jest.mocked(verifyGuestSession).mockResolvedValue(false);

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized.' });
    expect(mockCookieGet).toHaveBeenCalledWith(GUEST_SESSION_COOKIE);
    expect(getDashboardData).not.toHaveBeenCalled();
  });

  it('returns dashboard data for a valid guest session', async () => {
    const dashboardData = {
      summaryCards: [],
      chart: [],
      recentRepairJobs: [],
      attentionItems: [],
      todaySchedule: [],
    } as Awaited<ReturnType<typeof getDashboardData>>;
    jest.mocked(verifyGuestSession).mockResolvedValue(true);
    jest.mocked(getDashboardData).mockResolvedValue(dashboardData);

    const response = await GET();

    expect(verifyGuestSession).toHaveBeenCalledWith('session-token');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(dashboardData);
  });

  it('returns 500 when dashboard data cannot be loaded', async () => {
    const error = new Error('Database unavailable');
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(verifyGuestSession).mockResolvedValue(true);
    jest.mocked(getDashboardData).mockRejectedValue(error);

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Unable to load dashboard data.',
    });
    expect(consoleError).toHaveBeenCalledWith('Dashboard data request failed:', error);
    consoleError.mockRestore();
  });
});