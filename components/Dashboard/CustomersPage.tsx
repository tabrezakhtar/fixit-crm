'use client';

import { Card, Group, Stack, Table, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './DataTable.module.css';

export interface CustomerGridRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatUtcDate(value: Date | string) {
  return `${new Date(value).toISOString().replace('T', ' ').slice(0, 16)} UTC`;
}

export function CustomersPage({ customers }: { customers: CustomerGridRow[] }) {
  const [query, setQuery] = useState('');
  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer)
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>Customers</Text>
          <Text size="sm" c="dimmed">Manage your customer directory</Text>
        </div>
        <Text size="sm" c="dimmed">{customers.length} customers</Text>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <Text fw={600}>All customers</Text>
          <TextInput
            aria-label="Search customers"
            placeholder="Search customers..."
            leftSection={<IconSearch size={16} />}
            size="xs"
            radius="md"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            w={{ base: '100%', sm: 280 }}
          />
        </Group>

        <div className={classes.scrollContainer}>
          <Table
            className={classes.customerTable}
            horizontalSpacing="lg"
            verticalSpacing="md"
            highlightOnHover
          >
            <thead>
              <tr>
                <th className={classes.headerCell}>ID</th>
                <th className={classes.headerCell}>First name</th>
                <th className={classes.headerCell}>Last name</th>
                <th className={classes.headerCell}>Email</th>
                <th className={classes.headerCell}>Phone</th>
                <th className={classes.headerCell}>Company</th>
                <th className={classes.headerCell}>Address line 1</th>
                <th className={classes.headerCell}>Address line 2</th>
                <th className={classes.headerCell}>City</th>
                <th className={classes.headerCell}>County</th>
                <th className={classes.headerCell}>Postcode</th>
                <th className={classes.headerCell}>Country</th>
                <th className={classes.headerCell}>Notes</th>
                <th className={classes.headerCell}>Active</th>
                <th className={classes.headerCell}>Created at</th>
                <th className={classes.headerCell}>Updated at</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className={classes.cell}>{customer.id}</td>
                    <td className={classes.cell}>{customer.firstName}</td>
                    <td className={classes.cell}>{customer.lastName}</td>
                    <td className={classes.cell}>{customer.email}</td>
                    <td className={classes.cell}>{customer.phone || '—'}</td>
                    <td className={classes.cell}>{customer.company || '—'}</td>
                    <td className={classes.cell}>{customer.addressLine1 || '—'}</td>
                    <td className={classes.cell}>{customer.addressLine2 || '—'}</td>
                    <td className={classes.cell}>{customer.city || '—'}</td>
                    <td className={classes.cell}>{customer.county || '—'}</td>
                    <td className={classes.cell}>{customer.postcode || '—'}</td>
                    <td className={classes.cell}>{customer.country || '—'}</td>
                    <td className={classes.notesCell}><Text size="sm" lineClamp={2}>{customer.notes || '—'}</Text></td>
                    <td className={classes.cell}>
                      <span className={customer.isActive ? classes.activeStatus : classes.inactiveStatus}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={classes.cell}>{formatUtcDate(customer.createdAt)}</td>
                    <td className={classes.cell}>{formatUtcDate(customer.updatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={16}>
                    <Text ta="center" c="dimmed" py="lg">
                      {customers.length === 0 ? 'No customers found.' : 'No customers match your search.'}
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