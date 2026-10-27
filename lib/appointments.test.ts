import { AppointmentStatus } from '../generated/prisma/client';
import { getAppointments } from './appointments';
import { prisma } from './prisma';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { appointment: { findMany: jest.fn() } },
}));

describe('getAppointments', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps appointment records to schedule events with one-hour duration', async () => {
    const scheduledAt = new Date('2026-10-21T23:30:00.000Z');
    jest.mocked(prisma.appointment.findMany).mockResolvedValue([
      {
        id: BigInt(42),
        scheduledAt,
        repairType: 'Screen repair',
        status: AppointmentStatus.Confirmed,
        customer: { firstName: 'Alex', lastName: 'Smith' },
        technician: null,
      },
    ] as never);

    await expect(getAppointments()).resolves.toEqual([
      {
        id: '42',
        title: 'Alex Smith · Screen repair',
        start: '2026-10-21 23:30:00',
        end: '2026-10-22 00:30:00',
        color: 'blue',
      },
    ]);
    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ scheduledAt: 'asc' }, { id: 'asc' }] })
    );
  });
});
