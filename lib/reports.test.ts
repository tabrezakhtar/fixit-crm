import { InvoiceStatus, RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';
import { getReports } from './reports';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: {
    repairJob: { groupBy: jest.fn() },
    invoice: { findMany: jest.fn() },
    payment: { findMany: jest.fn() },
    inventoryItem: { findMany: jest.fn() },
    technician: { findMany: jest.fn() },
  },
}));

describe('getReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(prisma.repairJob.groupBy).mockResolvedValue([
      { status: RepairJobStatus.InProgress, _count: { _all: 2 } },
      { status: RepairJobStatus.ReadyForCollection, _count: { _all: 1 } },
    ] as never);
    jest.mocked(prisma.invoice.findMany).mockResolvedValue([
      {
        reference: 'INV-1001',
        status: InvoiceStatus.Sent,
        dueAt: new Date('2026-11-18T00:00:00.000Z'),
        customer: { firstName: 'Alex', lastName: 'Smith' },
        items: [{ quantity: 1, unitPricePence: 1000 }],
        payments: [{ amountPence: 200 }],
      },
    ] as never);
    jest.mocked(prisma.payment.findMany).mockResolvedValue([] as never);
    jest.mocked(prisma.inventoryItem.findMany).mockResolvedValue([
      {
        sku: 'BAT-01',
        name: 'Phone battery',
        category: 'Batteries',
        supplier: 'Parts Co',
        quantityOnHand: 0,
        reorderLevel: 2,
      },
    ] as never);
    jest.mocked(prisma.technician.findMany).mockResolvedValue([] as never);
  });

  it('builds repair status, outstanding balance, and low stock reports', async () => {
    const reports = await getReports();
    const repairStatus = reports.find((report) => report.id === 'repair-status');
    const outstandingInvoices = reports.find((report) => report.id === 'outstanding-invoices');
    const lowStock = reports.find((report) => report.id === 'low-stock');

    expect(repairStatus?.rows).toEqual([
      expect.objectContaining({ subject: RepairJobStatus.InProgress, metric: '2', status: '67%' }),
      expect.objectContaining({
        subject: RepairJobStatus.ReadyForCollection,
        metric: '1',
        status: '33%',
      }),
    ]);
    expect(outstandingInvoices?.rows).toEqual([
      expect.objectContaining({ subject: 'INV-1001', detail: 'Alex Smith · 18 Nov 2026', metric: '£8.00' }),
    ]);
    expect(lowStock?.rows).toEqual([
      expect.objectContaining({ subject: 'Phone battery', metric: '0 / 2', status: 'Out of stock' }),
    ]);
  });
});