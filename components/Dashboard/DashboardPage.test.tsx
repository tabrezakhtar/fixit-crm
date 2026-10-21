import { render, screen, waitFor } from '../../test-utils';
import type { getDashboardData } from '../../lib/dashboard';
import { DashboardPage } from './DashboardPage';

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

const fetchMock = jest.fn();
const originalFetch = global.fetch;

const dashboardData: DashboardData = {
  summaryCards: [
    {
      label: 'Jobs In Progress',
      value: '12',
      delta: 'Current jobs',
      trend: 'flat',
      color: 'blue',
      icon: 'tool',
    },
  ],
  chart: [],
  attentionItems: [],
  recentRepairJobs: [],
  todaySchedule: [],
};

describe('DashboardPage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('shows loading content while dashboard data is being fetched', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<DashboardPage username="Alex" />);

    expect(screen.getByLabelText('Loading repair job chart')).toBeInTheDocument();
  });

  it('shows dashboard data after a successful response', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => dashboardData,
    });

    render(<DashboardPage username="Alex" />);

    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/dashboard', expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it('shows an error message when the request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    render(<DashboardPage username="Alex" />);

    expect(await screen.findByText('Dashboard unavailable')).toBeInTheDocument();
    expect(screen.getByText('Unable to load dashboard data. Refresh to try again.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByLabelText('Loading repair job chart')).not.toBeInTheDocument());
  });
});