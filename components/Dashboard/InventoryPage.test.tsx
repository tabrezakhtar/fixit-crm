import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { InventoryListItem } from './data';
import { InventoryPage } from './InventoryPage';

const items: InventoryListItem[] = [
  {
    sku: 'SCR-01',
    name: 'Phone display assembly',
    category: 'Screens',
    supplier: 'Northstar Components',
    quantityOnHand: 1,
    reorderLevel: 3,
    unitCostPence: 6000,
    location: 'A1',
    stockStatus: 'Low stock',
  },
  {
    sku: 'BAT-01',
    name: 'Phone battery',
    category: 'Batteries',
    supplier: 'MobileFix Wholesale',
    quantityOnHand: 8,
    reorderLevel: 3,
    unitCostPence: 2000,
    location: 'B1',
    stockStatus: 'In stock',
  },
];

describe('InventoryPage', () => {
  it('filters the table to parts that need reorder', async () => {
    const user = userEvent.setup();
    render(<InventoryPage items={items} />);

    await user.click(screen.getByRole('radio', { name: 'Needs reorder' }));

    expect(screen.getByText('Phone display assembly')).toBeInTheDocument();
    expect(screen.queryByText('Phone battery')).not.toBeInTheDocument();
  });

  it('shows an empty state when no inventory exists', () => {
    render(<InventoryPage items={[]} />);

    expect(screen.getByText('No inventory items found.')).toBeInTheDocument();
  });
});