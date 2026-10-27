import { AppointmentStatus, RepairJobStatus } from '../generated/prisma/client';
import { getDashboardData } from './dashboard';
import { prisma } from './prisma';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: {
    repairJob: { groupBy: jest.fn(), findMany: jest.fn() },
    appointment: { findMany: jest.fn() },
  },
}));

describe('getDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-21T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('aggregates summary counts, chart totals, jobs, attention items, and today schedule', async () => {
    jest
      .mocked(prisma.repairJob.groupBy)
      .mockResolvedValue([{ status: RepairJobStatus.AwaitingParts, _count: { _all: 2 } }] as never);
    jest
      .mocked(prisma.repairJob.findMany)
      .mockResolvedValueOnce([
        {
          reference: 'JOB-1',
          equipment: 'ThinkPad X1',
          issue: 'Damaged screen',
          status: RepairJobStatus.AwaitingParts,
          dateReceived: new Date('2026-10-20T00:00:00.000Z'),
          customer: { firstName: 'Alex', lastName: 'Smith' },
          technician: null,
        },
      ] as never)
      .mockResolvedValueOnce([
        {
          reference: 'JOB-2',
          issue: 'Cracked case',
          status: RepairJobStatus.Overdue,
          dateReceived: new Date('2026-10-19T00:00:00.000Z'),
          customer: { firstName: 'Sam', lastName: 'Jones' },
        },
      ] as never)
      .mockResolvedValueOnce([
        {
          dateReceived: new Date('2026-10-21T10:00:00.000Z'),
          status: RepairJobStatus.ReadyForCollection,
        },
        {
          dateReceived: new Date('2026-10-21T11:00:00.000Z'),
          status: RepairJobStatus.AwaitingParts,
        },
        { dateReceived: new Date('2026-10-10T11:00:00.000Z'), status: RepairJobStatus.Overdue },
      ] as never);
    jest.mocked(prisma.appointment.findMany).mockResolvedValue([
      {
        scheduledAt: new Date('2026-10-21T09:15:00.000Z'),
        repairType: 'Laptop drop-off',
        status: AppointmentStatus.Confirmed,
        customer: { firstName: 'Taylor', lastName: 'Reed' },
        technician: null,
      },
    ] as never);

    const result = await getDashboardData();

    expect(result.summaryCards.find((card) => card.label === 'Awaiting Parts')?.value).toBe('2');
    expect(result.summaryCards.find((card) => card.label === 'Jobs In Progress')?.value).toBe('0');
    expect(result.chart).toHaveLength(7);
    expect(result.chart.find((day) => day.day === 'Wed')).toEqual({
      day: 'Wed',
      created: 2,
      readyForCollection: 1,
    });
    expect(result.recentRepairJobs[0]).toMatchObject({
      reference: 'JOB-1',
      customer: 'Alex Smith',
      status: 'Awaiting Parts',
      technician: 'Unassigned',
      dateReceived: '20 Oct 2026',
    });
    expect(result.attentionItems[0]).toMatchObject({
      reference: 'JOB-2',
      customer: 'Sam Jones',
      status: 'Overdue',
      due: 'Received 19 Oct 2026',
    });
    expect(result.todaySchedule[0]).toEqual({
      time: '09:15',
      customer: 'Taylor Reed',
      repairType: 'Laptop drop-off',
      technician: 'Unassigned',
      status: 'Confirmed',
    });
  });
});
