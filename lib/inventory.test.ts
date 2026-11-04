import { prisma } from './prisma';
import { getInventoryItems } from './inventory';

jest.mock('server-only', () => ({}));
jest.mock('next/cache', () => ({ cacheLife: jest.fn() }));
jest.mock('./prisma', () => ({
  prisma: { inventoryItem: { findMany: jest.fn() } },
}));

describe('getInventoryItems', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps stock counts to inventory status', async () => {
    jest.mocked(prisma.inventoryItem.findMany).mockResolvedValue([
      {
        sku: 'PART-1',
        name: 'Display assembly',
        category: 'Screens',
        supplier: 'Parts Co',
        quantityOnHand: 0,
        reorderLevel: 2,
        unitCostPence: 5000,
        location: null,
      },
      {
        sku: 'PART-2',
        name: 'Battery',
        category: 'Batteries',
        supplier: 'Parts Co',
        quantityOnHand: 2,
        reorderLevel: 2,
        unitCostPence: 2500,
        location: 'B1',
      },
      {
        sku: 'PART-3',
        name: 'SSD',
        category: 'Storage',
        supplier: 'Parts Co',
        quantityOnHand: 5,
        reorderLevel: 2,
        unitCostPence: 4000,
        location: 'C1',
      },
    ] as never);

    await expect(getInventoryItems()).resolves.toEqual([
      expect.objectContaining({ sku: 'PART-1', stockStatus: 'Out of stock', location: 'Not set' }),
      expect.objectContaining({ sku: 'PART-2', stockStatus: 'Low stock', location: 'B1' }),
      expect.objectContaining({ sku: 'PART-3', stockStatus: 'In stock', location: 'C1' }),
    ]);
  });
});