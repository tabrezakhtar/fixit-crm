'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import type { InventoryListItem, InventoryStockStatus } from './data';
import classes from './DataTable.module.css';

const stockFilters = [
  { label: 'All stock', value: 'All' },
  { label: 'Needs reorder', value: 'Needs reorder' },
  { label: 'Out of stock', value: 'Out of stock' },
];
const stockColors: Record<InventoryStockStatus, string> = {
  'In stock': 'green',
  'Low stock': 'orange',
  'Out of stock': 'red',
};
const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function InventoryPage({ items }: { items: InventoryListItem[] }) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState('All');
  const categories = Array.from(new Set(items.map((item) => item.category))).sort();
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesQuery = [item.sku, item.name, item.category, item.supplier, item.location].some(
      (value) => value.toLowerCase().includes(normalizedQuery)
    );
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'Needs reorder' && item.stockStatus !== 'In stock') ||
      item.stockStatus === stockFilter;

    return matchesQuery && matchesCategory && matchesStock;
  });
  const lowStockCount = items.filter((item) => item.stockStatus === 'Low stock').length;
  const outOfStockCount = items.filter((item) => item.stockStatus === 'Out of stock').length;
  const stockValue = items.reduce(
    (total, item) => total + item.quantityOnHand * item.unitCostPence,
    0
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Parts &amp; Inventory
          </Text>
          <Text size="sm" c="dimmed">
            Parts availability, reorder thresholds, and stock value
          </Text>
        </div>
        <Text size="sm" c="dimmed">
          {items.length} stock items
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Inventory value
          </Text>
          <Text size="xl" fw={700}>
            {currency.format(stockValue / 100)}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Low stock
          </Text>
          <Text size="xl" fw={700} c="orange.7">
            {lowStockCount}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Out of stock
          </Text>
          <Text size="xl" fw={700} c="red.7">
            {outOfStockCount}
          </Text>
        </Card>
      </SimpleGrid>

      <Group justify="space-between" align="center" wrap="wrap">
        <SegmentedControl
          aria-label="Filter stock status"
          data={stockFilters}
          value={stockFilter}
          onChange={setStockFilter}
          size="xs"
        />
        <Group w={{ base: '100%', sm: 'auto' }} grow>
          <TextInput
            aria-label="Search inventory"
            placeholder="Search parts, SKU, or supplier..."
            leftSection={<IconSearch size={16} />}
            size="xs"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            w={{ base: '100%', sm: 270 }}
          />
          <Select
            aria-label="Filter inventory category"
            placeholder="All categories"
            data={categories}
            clearable
            searchable
            size="xs"
            value={categoryFilter}
            onChange={setCategoryFilter}
            w={{ base: '100%', sm: 190 }}
          />
        </Group>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>Stock items</Text>
            <Text size="xs" c="dimmed">
              Showing {filteredItems.length} of {items.length}
            </Text>
          </div>
        </Group>
        <div className={classes.scrollContainer}>
          <Table
            className={classes.repairTable}
            horizontalSpacing="md"
            verticalSpacing="sm"
            highlightOnHover
          >
            <thead>
              <tr>
                <th className={classes.headerCell}>Part</th>
                <th className={classes.headerCell}>Category</th>
                <th className={classes.headerCell}>Supplier</th>
                <th className={classes.headerCell}>On hand</th>
                <th className={classes.headerCell}>Reorder at</th>
                <th className={classes.headerCell}>Unit cost</th>
                <th className={classes.headerCell}>Location</th>
                <th className={classes.headerCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.sku}>
                    <td className={classes.cell}>
                      <Text size="sm" fw={600}>
                        {item.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.sku}
                      </Text>
                    </td>
                    <td className={classes.cell}>{item.category}</td>
                    <td className={classes.cell}>{item.supplier}</td>
                    <td className={classes.cell}>{item.quantityOnHand}</td>
                    <td className={classes.cell}>{item.reorderLevel}</td>
                    <td className={classes.cell}>{currency.format(item.unitCostPence / 100)}</td>
                    <td className={classes.cell}>{item.location}</td>
                    <td className={classes.cell}>
                      <Badge variant="light" color={stockColors[item.stockStatus]}>
                        {item.stockStatus}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <Text ta="center" c="dimmed" py="lg">
                      {items.length === 0
                        ? 'No inventory items found.'
                        : 'No items match your filters.'}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Stack>
  );
}