import { QuoteStatus } from '../generated/prisma/client';
import { prisma } from './prisma';
import { getQuotes } from './quotes';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { quote: { findMany: jest.fn() } },
}));

describe('getQuotes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps quote relations, status, item totals and dates for the list', async () => {
    jest.mocked(prisma.quote.findMany).mockResolvedValue([
      {
        reference: 'QT-3101',
        status: QuoteStatus.Sent,
        issuedAt: new Date('2026-10-12T00:00:00.000Z'),
        validUntil: new Date('2026-10-26T00:00:00.000Z'),
        customer: { firstName: 'Grace', lastName: 'Lin', email: 'grace@example.com' },
        repairJob: { reference: 'RJ-2045', equipment: 'MacBook Air M2' },
        items: [
          { quantity: 2, unitPricePence: 650 },
          { quantity: 1, unitPricePence: 100 },
        ],
      },
    ] as never);

    await expect(getQuotes()).resolves.toEqual([
      {
        reference: 'QT-3101',
        customer: 'Grace Lin',
        customerEmail: 'grace@example.com',
        repairReference: 'RJ-2045',
        equipment: 'MacBook Air M2',
        status: 'Sent',
        totalPence: 1400,
        issuedAt: '12 Oct 2026',
        validUntil: '26 Oct 2026',
      },
    ]);
    expect(prisma.quote.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ issuedAt: 'desc' }, { id: 'desc' }] })
    );
  });
});