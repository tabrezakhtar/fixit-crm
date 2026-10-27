import { RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';
import { getRepairJobs } from './repair-jobs';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { repairJob: { findMany: jest.fn() } },
}));

describe('getRepairJobs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps job status, customer and unassigned technician into list items', async () => {
    jest.mocked(prisma.repairJob.findMany).mockResolvedValue([
      {
        reference: 'JOB-12',
        equipment: 'Pixel 9',
        issue: 'Battery replacement',
        status: RepairJobStatus.AwaitingDiagnosis,
        dateReceived: new Date('2026-10-21T00:00:00.000Z'),
        customer: { firstName: 'Alex', lastName: 'Smith', email: 'alex@example.com' },
        technician: null,
      },
    ] as never);

    await expect(getRepairJobs()).resolves.toEqual([
      {
        reference: 'JOB-12',
        customer: 'Alex Smith',
        customerEmail: 'alex@example.com',
        equipment: 'Pixel 9',
        issue: 'Battery replacement',
        status: 'Awaiting Diagnosis',
        technician: 'Unassigned',
        dateReceived: '21 Oct 2026',
      },
    ]);
    expect(prisma.repairJob.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ dateReceived: 'desc' }, { id: 'desc' }] })
    );
  });
});
