import { InvoiceStatus, PaymentMethod } from '../generated/prisma/client';
import { prisma } from './prisma';
import { getInvoicesAndPayments } from './invoices';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { invoice: { findMany: jest.fn() } },
}));

describe('getInvoicesAndPayments', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps invoice balances and associated payments', async () => {
    jest.mocked(prisma.invoice.findMany).mockResolvedValue([
      {
        reference: 'INV-4102',
        status: InvoiceStatus.PartiallyPaid,
        issuedAt: new Date('2026-10-12T00:00:00.000Z'),
        dueAt: new Date('2026-10-26T00:00:00.000Z'),
        customer: { firstName: 'Marcus', lastName: 'Webb', email: 'marcus@example.com' },
        repairJob: { reference: 'RJ-2049' },
        items: [
          { quantity: 1, unitPricePence: 6500 },
          { quantity: 1, unitPricePence: 12800 },
        ],
        payments: [
          {
            amountPence: 6500,
            method: PaymentMethod.Card,
            reference: 'CARD-82041',
            paidAt: new Date('2026-10-13T00:00:00.000Z'),
          },
        ],
      },
    ] as never);

    await expect(getInvoicesAndPayments()).resolves.toEqual({
      invoices: [
        {
          reference: 'INV-4102',
          customer: 'Marcus Webb',
          customerEmail: 'marcus@example.com',
          repairReference: 'RJ-2049',
          status: 'Partially paid',
          totalPence: 19300,
          paidPence: 6500,
          outstandingPence: 12800,
          issuedAt: '12 Oct 2026',
          dueAt: '26 Oct 2026',
          paymentCount: 1,
        },
      ],
      payments: [
        {
          invoiceReference: 'INV-4102',
          customer: 'Marcus Webb',
          amountPence: 6500,
          method: PaymentMethod.Card,
          reference: 'CARD-82041',
          paidAt: '13 Oct 2026',
        },
      ],
    });
  });
});