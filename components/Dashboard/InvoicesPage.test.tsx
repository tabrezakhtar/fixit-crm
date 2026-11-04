import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { InvoiceListItem, PaymentListItem } from './data';
import { InvoicesPage } from './InvoicesPage';

const invoices: InvoiceListItem[] = [
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
];
const payments: PaymentListItem[] = [
  {
    invoiceReference: 'INV-4102',
    customer: 'Marcus Webb',
    amountPence: 6500,
    method: 'Card',
    reference: 'CARD-82041',
    paidAt: '13 Oct 2026',
  },
];

describe('InvoicesPage', () => {
  it('switches to payments and searches payment records', async () => {
    const user = userEvent.setup();
    render(<InvoicesPage invoices={invoices} payments={payments} />);

    await user.click(screen.getByRole('radio', { name: 'Payments (1)' }));

    expect(screen.getByText('Payment history')).toBeInTheDocument();
    expect(screen.getByText('CARD-82041')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search payments' }), 'unknown');
    expect(screen.getByText('No payments match your search.')).toBeInTheDocument();
  });

  it('shows invoice balances and empty payment state', async () => {
    const user = userEvent.setup();
    render(<InvoicesPage invoices={invoices} payments={[]} />);

    expect(screen.getByText('INV-4102')).toBeInTheDocument();
    expect(screen.getAllByText('£128.00')).toHaveLength(2);
    await user.click(screen.getByRole('radio', { name: 'Payments (0)' }));
    expect(screen.getByText('No payments recorded.')).toBeInTheDocument();
  });
});