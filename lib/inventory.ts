import { cacheLife } from 'next/cache';
import 'server-only';
import type { InventoryListItem, InventoryStockStatus } from '../components/Dashboard/data';
import { prisma } from './prisma';

export async function getInventoryItems(): Promise<InventoryListItem[]> {
  'use cache';
  cacheLife('hours');

  const items = await prisma.inventoryItem.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return items.map((item) => {
    let stockStatus: InventoryStockStatus = 'In stock';
    if (item.quantityOnHand === 0) stockStatus = 'Out of stock';
    else if (item.quantityOnHand <= item.reorderLevel) stockStatus = 'Low stock';

    return {
      sku: item.sku,
      name: item.name,
      category: item.category,
      supplier: item.supplier,
      quantityOnHand: item.quantityOnHand,
      reorderLevel: item.reorderLevel,
      unitCostPence: item.unitCostPence,
      location: item.location ?? 'Not set',
      stockStatus,
    };
  });
}