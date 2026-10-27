import { RepairJobStatus } from '../generated/prisma/client';
import { getEquipmentModels } from './equipment';
import { prisma } from './prisma';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { repairJob: { findMany: jest.fn() } },
}));

describe('getEquipmentModels', () => {
  beforeEach(() => jest.clearAllMocks());

  it('groups matching equipment names and keeps the latest repair details', async () => {
    jest.mocked(prisma.repairJob.findMany).mockResolvedValue([
      {
        reference: 'JOB-2',
        equipment: ' ThinkPad X1 ',
        issue: 'Newer issue',
        status: RepairJobStatus.AwaitingParts,
        dateReceived: new Date('2026-10-21T00:00:00.000Z'),
        customer: { firstName: 'Alex', lastName: 'Smith' },
      },
      {
        reference: 'JOB-1',
        equipment: 'thinkpad x1',
        issue: 'Older issue',
        status: RepairJobStatus.InProgress,
        dateReceived: new Date('2026-10-20T00:00:00.000Z'),
        customer: { firstName: 'Sam', lastName: 'Jones' },
      },
      {
        reference: 'JOB-3',
        equipment: 'Pixel 9',
        issue: 'Cracked screen',
        status: RepairJobStatus.Overdue,
        dateReceived: new Date('2026-10-19T00:00:00.000Z'),
        customer: { firstName: 'Taylor', lastName: 'Reed' },
      },
      {
        reference: 'JOB-4',
        equipment: 'Amplifier',
        issue: 'No sound',
        status: RepairJobStatus.AwaitingDiagnosis,
        dateReceived: new Date('2026-10-18T00:00:00.000Z'),
        customer: { firstName: 'Jamie', lastName: 'Park' },
      },
    ] as never);

    await expect(getEquipmentModels()).resolves.toEqual([
      {
        name: 'ThinkPad X1',
        category: 'Laptop',
        repairCount: 2,
        latestRepair: {
          reference: 'JOB-2',
          customer: 'Alex Smith',
          issue: 'Newer issue',
          status: 'Awaiting Parts',
          dateReceived: '21 Oct 2026',
        },
      },
      {
        name: 'Pixel 9',
        category: 'Phone',
        repairCount: 1,
        latestRepair: {
          reference: 'JOB-3',
          customer: 'Taylor Reed',
          issue: 'Cracked screen',
          status: 'Overdue',
          dateReceived: '19 Oct 2026',
        },
      },
      {
        name: 'Amplifier',
        category: 'Other',
        repairCount: 1,
        latestRepair: {
          reference: 'JOB-4',
          customer: 'Jamie Park',
          issue: 'No sound',
          status: 'Awaiting Diagnosis',
          dateReceived: '18 Oct 2026',
        },
      },
    ]);
  });
});
