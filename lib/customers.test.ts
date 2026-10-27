import { getCustomers } from './customers';
import { prisma } from './prisma';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { customer: { findMany: jest.fn() } },
}));

describe('getCustomers', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns customer records from the newest 100 customers', async () => {
    const customers = [{ id: BigInt(7), firstName: 'Alex', lastName: 'Smith' }];
    jest.mocked(prisma.customer.findMany).mockResolvedValue(customers as never);

    await expect(getCustomers()).resolves.toBe(customers);
    expect(prisma.customer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'desc' }, take: 100 })
    );
  });
});
