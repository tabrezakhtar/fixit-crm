import { cacheLife } from 'next/cache';
import 'server-only';
import type { QuoteListItem, QuoteStatusLabel } from '../components/Dashboard/data';
import { QuoteStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

const quoteStatusLabels: Record<QuoteStatus, QuoteStatusLabel> = {
  [QuoteStatus.Draft]: 'Draft',
  [QuoteStatus.Sent]: 'Sent',
  [QuoteStatus.Accepted]: 'Accepted',
  [QuoteStatus.Declined]: 'Declined',
  [QuoteStatus.Expired]: 'Expired',
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}

export async function getQuotes(): Promise<QuoteListItem[]> {
  'use cache';
  cacheLife('hours');

  const quotes = await prisma.quote.findMany({
    orderBy: [{ issuedAt: 'desc' }, { id: 'desc' }],
    include: {
      customer: { select: { firstName: true, lastName: true, email: true } },
      repairJob: { select: { reference: true, equipment: true } },
      items: { select: { quantity: true, unitPricePence: true } },
    },
  });

  return quotes.map((quote) => ({
    reference: quote.reference,
    customer: `${quote.customer.firstName} ${quote.customer.lastName}`,
    customerEmail: quote.customer.email,
    repairReference: quote.repairJob?.reference ?? 'Standalone quote',
    equipment: quote.repairJob?.equipment ?? 'Not linked to a repair job',
    status: quoteStatusLabels[quote.status],
    totalPence: quote.items.reduce(
      (total, item) => total + item.quantity * item.unitPricePence,
      0
    ),
    issuedAt: formatDate(quote.issuedAt),
    validUntil: formatDate(quote.validUntil),
  }));
}