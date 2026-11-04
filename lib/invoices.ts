import { cacheLife } from 'next/cache';
import 'server-only';
import type {
  InvoiceListItem,
  InvoiceStatusLabel,
  PaymentListItem,
} from '../components/Dashboard/data';
import { InvoiceStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

const invoiceStatusLabels: Record<InvoiceStatus, InvoiceStatusLabel> = {
  [InvoiceStatus.Draft]: 'Draft',
  [InvoiceStatus.Sent]: 'Sent',
  [InvoiceStatus.PartiallyPaid]: 'Partially paid',
  [InvoiceStatus.Paid]: 'Paid',
  [InvoiceStatus.Overdue]: 'Overdue',
  [InvoiceStatus.Void]: 'Void',
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}

export async function getInvoicesAndPayments(): Promise<{
  invoices: InvoiceListItem[];
  payments: PaymentListItem[];
}> {
  'use cache';
  cacheLife('hours');

  const records = await prisma.invoice.findMany({
    orderBy: [{ issuedAt: 'desc' }, { id: 'desc' }],
    include: {
      customer: { select: { firstName: true, lastName: true, email: true } },
      repairJob: { select: { reference: true } },
      items: { select: { quantity: true, unitPricePence: true } },
      payments: { orderBy: [{ paidAt: 'desc' }, { id: 'desc' }] },
    },
  });

  const invoices = records.map((invoice) => {
    const totalPence = invoice.items.reduce(
      (total, item) => total + item.quantity * item.unitPricePence,
      0
    );
    const paidPence = invoice.payments.reduce((total, payment) => total + payment.amountPence, 0);

    return {
      reference: invoice.reference,
      customer: `${invoice.customer.firstName} ${invoice.customer.lastName}`,
      customerEmail: invoice.customer.email,
      repairReference: invoice.repairJob?.reference ?? 'Standalone invoice',
      status: invoiceStatusLabels[invoice.status],
      totalPence,
      paidPence,
      outstandingPence: Math.max(totalPence - paidPence, 0),
      issuedAt: formatDate(invoice.issuedAt),
      dueAt: formatDate(invoice.dueAt),
      paymentCount: invoice.payments.length,
    };
  });

  const payments = records.flatMap((invoice) =>
    invoice.payments.map((payment) => ({
      invoiceReference: invoice.reference,
      customer: `${invoice.customer.firstName} ${invoice.customer.lastName}`,
      amountPence: payment.amountPence,
      method: payment.method,
      reference: payment.reference ?? 'No reference',
      paidAt: formatDate(payment.paidAt),
    }))
  );

  return { invoices, payments };
}