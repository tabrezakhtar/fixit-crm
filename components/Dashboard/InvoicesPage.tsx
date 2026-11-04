'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import type {
  InvoiceListItem,
  InvoiceStatusLabel,
  PaymentListItem,
} from './data';
import classes from './DataTable.module.css';

const invoiceStatuses: InvoiceStatusLabel[] = [
  'Draft',
  'Sent',
  'Partially paid',
  'Paid',
  'Overdue',
  'Void',
];
const invoiceStatusColors: Record<InvoiceStatusLabel, string> = {
  Draft: 'gray',
  Sent: 'blue',
  'Partially paid': 'orange',
  Paid: 'green',
  Overdue: 'red',
  Void: 'dark',
};
const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function InvoicesPage({
  invoices,
  payments,
}: {
  invoices: InvoiceListItem[];
  payments: PaymentListItem[];
}) {
  const [view, setView] = useState('invoices');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesQuery = Object.values(invoice).some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery)
    );
    return matchesQuery && (!statusFilter || invoice.status === statusFilter);
  });
  const filteredPayments = payments.filter((payment) =>
    Object.values(payment).some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery)
    )
  );
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.totalPence, 0);
  const totalOutstanding = invoices
    .filter((invoice) => invoice.status !== 'Void')
    .reduce((sum, invoice) => sum + invoice.outstandingPence, 0);
  const totalReceived = payments.reduce((sum, payment) => sum + payment.amountPence, 0);
  const overdueCount = invoices.filter((invoice) => invoice.status === 'Overdue').length;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Invoices &amp; Payments
          </Text>
          <Text size="sm" c="dimmed">
            Monitor balances due and recorded customer payments
          </Text>
        </div>
        <Text size="sm" c="dimmed">
          {invoices.length} invoices · {payments.length} payments
        </Text>
      </Group>

      <Group grow align="stretch">
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Invoiced
          </Text>
          <Text size="xl" fw={700}>
            {currency.format(totalInvoiced / 100)}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Outstanding
          </Text>
          <Text size="xl" fw={700} c="orange.7">
            {currency.format(totalOutstanding / 100)}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Payments received
          </Text>
          <Text size="xl" fw={700} c="green.7">
            {currency.format(totalReceived / 100)}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Overdue invoices
          </Text>
          <Text size="xl" fw={700} c="red.7">
            {overdueCount}
          </Text>
        </Card>
      </Group>

      <Group justify="space-between" align="center" wrap="wrap">
        <SegmentedControl
          aria-label="Billing records"
          data={[
            { label: `Invoices (${invoices.length})`, value: 'invoices' },
            { label: `Payments (${payments.length})`, value: 'payments' },
          ]}
          value={view}
          onChange={(value) => {
            setView(value);
            setStatusFilter(null);
          }}
          size="xs"
        />
        <Group w={{ base: '100%', sm: 'auto' }} grow>
          <TextInput
            aria-label={`Search ${view}`}
            placeholder={view === 'invoices' ? 'Search invoices...' : 'Search payments...'}
            leftSection={<IconSearch size={16} />}
            size="xs"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            w={{ base: '100%', sm: 270 }}
          />
          {view === 'invoices' && (
            <Select
              aria-label="Filter invoices by status"
              placeholder="All statuses"
              data={invoiceStatuses}
              clearable
              size="xs"
              value={statusFilter}
              onChange={setStatusFilter}
              w={{ base: '100%', sm: 180 }}
            />
          )}
        </Group>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>{view === 'invoices' ? 'Invoices' : 'Payment history'}</Text>
            <Text size="xs" c="dimmed">
              {view === 'invoices'
                ? `Showing ${filteredInvoices.length} of ${invoices.length}`
                : `Showing ${filteredPayments.length} of ${payments.length}`}
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
            {view === 'invoices' ? (
              <>
                <thead>
                  <tr>
                    <th className={classes.headerCell}>Invoice</th>
                    <th className={classes.headerCell}>Customer</th>
                    <th className={classes.headerCell}>Repair</th>
                    <th className={classes.headerCell}>Status</th>
                    <th className={classes.headerCell}>Total</th>
                    <th className={classes.headerCell}>Paid</th>
                    <th className={classes.headerCell}>Due</th>
                    <th className={classes.headerCell}>Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.reference}>
                        <td className={classes.cell}>
                          <Text size="sm" fw={600}>
                            {invoice.reference}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Issued {invoice.issuedAt}
                          </Text>
                        </td>
                        <td className={classes.cell}>
                          <Text size="sm" fw={600}>
                            {invoice.customer}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {invoice.customerEmail}
                          </Text>
                        </td>
                        <td className={classes.cell}>{invoice.repairReference}</td>
                        <td className={classes.cell}>
                          <Badge variant="light" color={invoiceStatusColors[invoice.status]}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className={classes.cell}>{currency.format(invoice.totalPence / 100)}</td>
                        <td className={classes.cell}>{currency.format(invoice.paidPence / 100)}</td>
                        <td className={classes.cell}>
                          <Text fw={600} c={invoice.outstandingPence > 0 ? 'orange.8' : undefined}>
                            {currency.format(invoice.outstandingPence / 100)}
                          </Text>
                        </td>
                        <td className={classes.cell}>{invoice.dueAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <Text ta="center" c="dimmed" py="lg">
                          {invoices.length === 0
                            ? 'No invoices found.'
                            : 'No invoices match your filters.'}
                        </Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr>
                    <th className={classes.headerCell}>Date</th>
                    <th className={classes.headerCell}>Invoice</th>
                    <th className={classes.headerCell}>Customer</th>
                    <th className={classes.headerCell}>Method</th>
                    <th className={classes.headerCell}>Reference</th>
                    <th className={classes.headerCell}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <tr key={`${payment.invoiceReference}-${payment.reference}-${index}`}>
                        <td className={classes.cell}>{payment.paidAt}</td>
                        <td className={classes.cell}>{payment.invoiceReference}</td>
                        <td className={classes.cell}>{payment.customer}</td>
                        <td className={classes.cell}>{payment.method}</td>
                        <td className={classes.cell}>{payment.reference}</td>
                        <td className={classes.cell}>
                          <Text fw={600} c="green.8">
                            {currency.format(payment.amountPence / 100)}
                          </Text>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <Text ta="center" c="dimmed" py="lg">
                          {payments.length === 0
                            ? 'No payments recorded.'
                            : 'No payments match your search.'}
                        </Text>
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}
          </Table>
        </div>
      </Card>
    </Stack>
  );
}