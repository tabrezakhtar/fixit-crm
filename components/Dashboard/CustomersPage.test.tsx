import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { CustomerGridRow } from './CustomersPage';
import { CustomersPage } from './CustomersPage';

const customers: CustomerGridRow[] = [
  {
    id: 'customer-1',
    firstName: 'Alex',
    lastName: 'Smith',
    email: 'alex@example.com',
    phone: null,
    company: null,
    addressLine1: null,
    addressLine2: null,
    city: 'London',
    county: null,
    postcode: null,
    country: 'United Kingdom',
    notes: null,
    isActive: true,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'customer-2',
    firstName: 'Sam',
    lastName: 'Jones',
    email: 'sam@example.com',
    phone: '0123456789',
    company: null,
    addressLine1: null,
    addressLine2: null,
    city: 'Leeds',
    county: null,
    postcode: null,
    country: 'United Kingdom',
    notes: null,
    isActive: false,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  },
];

describe('CustomersPage', () => {
  it('filters customers by search text', async () => {
    const user = userEvent.setup();
    render(<CustomersPage customers={customers} />);

    await user.type(screen.getByRole('textbox', { name: 'Search customers' }), 'alex');

    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
    expect(screen.queryByText('sam@example.com')).not.toBeInTheDocument();
  });

  it('shows an empty state when the search has no matches', async () => {
    const user = userEvent.setup();
    render(<CustomersPage customers={customers} />);

    await user.type(screen.getByRole('textbox', { name: 'Search customers' }), 'unknown');

    expect(screen.getByText('No customers match your search.')).toBeInTheDocument();
  });
});