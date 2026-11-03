'use client';

import { useState } from 'react';
import { IconFileTypePdf, IconSearch } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Loader,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import type { QuoteListItem, QuoteStatusLabel } from './data';
import classes from './DataTable.module.css';

const statuses: QuoteStatusLabel[] = ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'];
const statusColors: Record<QuoteStatusLabel, string> = {
  Draft: 'gray',
  Sent: 'blue',
  Accepted: 'green',
  Declined: 'red',
  Expired: 'orange',
};
const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function QuotesPage({ quotes }: { quotes: QuoteListItem[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredQuotes = quotes.filter((quote) => {
    const matchesQuery = Object.values(quote).some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery)
    );
    return matchesQuery && (!statusFilter || quote.status === statusFilter);
  });
  const outstandingValue = quotes
    .filter((quote) => quote.status === 'Draft' || quote.status === 'Sent')
    .reduce((total, quote) => total + quote.totalPence, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Quotes &amp; Estimates
          </Text>
          <Text size="sm" c="dimmed">
            Review repair estimates and download customer-ready PDFs
          </Text>
        </div>
        <Group gap="xl">
          <div>
            <Text size="xs" c="dimmed">
              Total quotes
            </Text>
            <Text fw={700}>{quotes.length}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Awaiting response
            </Text>
            <Text fw={700}>{currency.format(outstandingValue / 100)}</Text>
          </div>
        </Group>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>All quotes</Text>
            <Text size="xs" c="dimmed">
              Showing {filteredQuotes.length} of {quotes.length}
            </Text>
          </div>
          <Group w={{ base: '100%', sm: 'auto' }} grow>
            <TextInput
              aria-label="Search quotes"
              placeholder="Search quotes..."
              leftSection={<IconSearch size={16} />}
              size="xs"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              w={{ base: '100%', sm: 230 }}
            />
            <Select
              aria-label="Filter by status"
              placeholder="All statuses"
              data={statuses}
              clearable
              size="xs"
              value={statusFilter}
              onChange={setStatusFilter}
              w={{ base: '100%', sm: 160 }}
            />
          </Group>
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
                <th className={classes.headerCell}>Quote</th>
                <th className={classes.headerCell}>Customer</th>
                <th className={classes.headerCell}>Repair</th>
                <th className={classes.headerCell}>Status</th>
                <th className={classes.headerCell}>Total</th>
                <th className={classes.headerCell}>Issued</th>
                <th className={classes.headerCell}>Valid until</th>
                <th className={classes.headerCell}>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr key={quote.reference}>
                    <td className={classes.cell}>
                      <Text size="sm" fw={600}>
                        {quote.reference}
                      </Text>
                    </td>
                    <td className={classes.cell}>
                      <Text size="sm" fw={600}>
                        {quote.customer}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {quote.customerEmail}
                      </Text>
                    </td>
                    <td className={classes.cell}>
                      <Text size="sm">{quote.repairReference}</Text>
                      <Text size="xs" c="dimmed">
                        {quote.equipment}
                      </Text>
                    </td>
                    <td className={classes.cell}>
                      <Badge variant="light" color={statusColors[quote.status]}>
                        {quote.status}
                      </Badge>
                    </td>
                    <td className={classes.cell}>{currency.format(quote.totalPence / 100)}</td>
                    <td className={classes.cell}>{quote.issuedAt}</td>
                    <td className={classes.cell}>{quote.validUntil}</td>
                    <td className={classes.cell}>
                      <Tooltip label={`View ${quote.reference} PDF`}>
                        <ActionIcon
                          onClick={() => {
                            setPdfLoading(true);
                            setSelectedQuote(quote.reference);
                          }}
                          aria-label={`View ${quote.reference} PDF`}
                          variant="subtle"
                          color="blue"
                        >
                          <IconFileTypePdf size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <Text ta="center" c="dimmed" py="lg">
                      {quotes.length === 0
                        ? 'No quotes found.'
                        : 'No quotes match your filters.'}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Modal
        opened={selectedQuote !== null}
        onClose={() => setSelectedQuote(null)}
        title={selectedQuote ? `Quote ${selectedQuote}` : 'Quote PDF'}
        centered
        size="94vw"
        padding="xs"
      >
        {selectedQuote && (
          <div style={{ position: 'relative' }} aria-busy={pdfLoading}>
            {pdfLoading && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'var(--mantine-color-body)',
                }}
              >
                <Stack align="center" gap="sm">
                  <Loader />
                  <Text size="sm" c="dimmed">
                    Generating PDF...
                  </Text>
                </Stack>
              </div>
            )}
            <iframe
              key={selectedQuote}
              title={`Quote ${selectedQuote} PDF`}
              src={`/api/quotes/${encodeURIComponent(selectedQuote)}/pdf`}
              onLoad={() => setPdfLoading(false)}
              style={{ display: 'block', width: '100%', height: '78vh', border: 0 }}
            />
          </div>
        )}
      </Modal>
    </Stack>
  );
}