import { RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';
import { getTechnicians } from './technicians';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { technician: { findMany: jest.fn() } },
}));

describe('getTechnicians', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps assigned, open, and overdue repair counts', async () => {
    jest.mocked(prisma.technician.findMany).mockResolvedValue([
      {
        id: BigInt(21),
        firstName: 'Alex',
        lastName: 'Smith',
        isActive: true,
        repairJobs: [
          { status: RepairJobStatus.InProgress },
          { status: RepairJobStatus.Overdue },
          { status: RepairJobStatus.ReadyForCollection },
        ],
        appointments: [{ id: BigInt(8) }, { id: BigInt(9) }],
      },
    ] as never);

    await expect(getTechnicians()).resolves.toEqual([
      {
        id: '21',
        name: 'Alex Smith',
        isActive: true,
        repairJobs: 3,
        openJobs: 2,
        overdueJobs: 1,
        appointments: 2,
      },
    ]);
  });
});