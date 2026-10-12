'use client';

import { Card, Group, Stack, Table, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

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
  createdAt: Date;
  updatedAt: Date;
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

        <Table.ScrollContainer minWidth={1900} type="native">
          <Table horizontalSpacing="md" verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta="left">ID</Table.Th>
                <Table.Th ta="left">First name</Table.Th>
                <Table.Th ta="left">Last name</Table.Th>
                <Table.Th ta="left">Email</Table.Th>
                <Table.Th ta="left">Phone</Table.Th>
                <Table.Th ta="left">Company</Table.Th>
                <Table.Th ta="left">Address line 1</Table.Th>
                <Table.Th ta="left">Address line 2</Table.Th>
                <Table.Th ta="left">City</Table.Th>
                <Table.Th ta="left">County</Table.Th>
                <Table.Th ta="left">Postcode</Table.Th>
                <Table.Th ta="left">Country</Table.Th>
                <Table.Th ta="left">Notes</Table.Th>
                <Table.Th ta="left">Active</Table.Th>
                <Table.Th ta="left">Created at</Table.Th>
                <Table.Th ta="left">Updated at</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <Table.Tr key={customer.id}>
                    <Table.Td>{customer.id}</Table.Td>
                    <Table.Td>{customer.firstName}</Table.Td>
                    <Table.Td>{customer.lastName}</Table.Td>
                    <Table.Td>{customer.email}</Table.Td>
                    <Table.Td>{customer.phone || '—'}</Table.Td>
                    <Table.Td>{customer.company || '—'}</Table.Td>
                    <Table.Td>{customer.addressLine1 || '—'}</Table.Td>
                    <Table.Td>{customer.addressLine2 || '—'}</Table.Td>
                    <Table.Td>{customer.city || '—'}</Table.Td>
                    <Table.Td>{customer.county || '—'}</Table.Td>
                    <Table.Td>{customer.postcode || '—'}</Table.Td>
                    <Table.Td>{customer.country || '—'}</Table.Td>
                    <Table.Td><Text size="sm" lineClamp={2}>{customer.notes || '—'}</Text></Table.Td>
                    <Table.Td>{customer.isActive ? 'Active' : 'Inactive'}</Table.Td>
                    <Table.Td>{customer.createdAt.toLocaleString()}</Table.Td>
                    <Table.Td>{customer.updatedAt.toLocaleString()}</Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={16}>
                    <Text ta="center" c="dimmed" py="lg">
                      {customers.length === 0 ? 'No customers found.' : 'No customers match your search.'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Stack>
  );
}