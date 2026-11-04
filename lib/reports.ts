import { cacheLife } from 'next/cache';
import 'server-only';
import type { ReportData, ReportId, ReportRow } from '../components/Dashboard/data';
import { InvoiceStatus, RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

const reportDefinitions: Record<
  ReportId,
  Omit<ReportData, 'rows'>
> = {
  'repair-status': {
    id: 'repair-status',
    label: 'Repair jobs by status',
    description: 'Current repair workload grouped by job status',
    subjectHeading: 'Status',
    detailHeading: 'Work queue',
    metricHeading: 'Jobs',
    statusHeading: 'Share',
  },
  'outstanding-invoices': {
    id: 'outstanding-invoices',
    label: 'Outstanding invoices',
    description: 'Sent, partially paid, and overdue balances',
    subjectHeading: 'Invoice',
    detailHeading: 'Customer · due date',
    metricHeading: 'Balance due',
    statusHeading: 'Status',
  },
  'payment-history': {
    id: 'payment-history',
    label: 'Payment history',
    description: 'Recorded customer payments, newest first',
    subjectHeading: 'Invoice',
    detailHeading: 'Customer · date · method',
    metricHeading: 'Amount',
    statusHeading: 'Reference',
  },
  'low-stock': {
    id: 'low-stock',
    label: 'Low stock report',
    description: 'Inventory items at or below reorder threshold',
    subjectHeading: 'Part',
    detailHeading: 'SKU · supplier',
    metricHeading: 'On hand / reorder at',
    statusHeading: 'Category',
  },
  'technician-workload': {
    id: 'technician-workload',
    label: 'Technician workload',
    description: 'Open repairs assigned to each active technician',
    subjectHeading: 'Technician',
    detailHeading: 'Assigned repair jobs',
    metricHeading: 'Open jobs',
    statusHeading: 'Availability',
  },
};

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}

export async function getReports(): Promise<ReportData[]> {
  'use cache';
  cacheLife('minutes');

  const [repairStatuses, invoices, payments, inventoryItems, technicians] = await Promise.all([
    prisma.repairJob.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.invoice.findMany({
      include: {
        customer: { select: { firstName: true, lastName: true } },
        items: { select: { quantity: true, unitPricePence: true } },
        payments: { select: { amountPence: true } },
      },
    }),
    prisma.payment.findMany({
      orderBy: [{ paidAt: 'desc' }, { id: 'desc' }],
      include: {
        invoice: { select: { reference: true, customer: { select: { firstName: true, lastName: true } } } },
      },
    }),
    prisma.inventoryItem.findMany({ orderBy: [{ quantityOnHand: 'asc' }, { name: 'asc' }] }),
    prisma.technician.findMany({
      where: { isActive: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      include: { repairJobs: { select: { status: true } } },
    }),
  ]);

  const totalRepairJobs = repairStatuses.reduce((total, item) => total + item._count._all, 0);
  const repairRows: ReportRow[] = repairStatuses
    .map((item) => ({
      id: item.status,
      subject: item.status,
      detail: item.status === RepairJobStatus.ReadyForCollection ? 'Ready for collection' : 'Open queue',
      metric: String(item._count._all),
      status: `${totalRepairJobs === 0 ? 0 : Math.round((item._count._all / totalRepairJobs) * 100)}%`,
    }))
    .sort((left, right) => Number(right.metric) - Number(left.metric));

  const invoiceRows: ReportRow[] = invoices
    .filter(
      (invoice) =>
        invoice.status === InvoiceStatus.Sent ||
        invoice.status === InvoiceStatus.PartiallyPaid ||
        invoice.status === InvoiceStatus.Overdue
    )
    .map((invoice) => {
      const totalPence = invoice.items.reduce(
        (total, item) => total + item.quantity * item.unitPricePence,
        0
      );
      const paidPence = invoice.payments.reduce((total, payment) => total + payment.amountPence, 0);

      return {
        id: invoice.reference,
        subject: invoice.reference,
        detail: `${invoice.customer.firstName} ${invoice.customer.lastName} · ${formatDate(invoice.dueAt)}`,
        metric: currency.format(Math.max(totalPence - paidPence, 0) / 100),
        status: invoice.status,
      };
    })
    .sort((left, right) => (left.status === 'Overdue' ? -1 : right.status === 'Overdue' ? 1 : 0));

  const paymentRows: ReportRow[] = payments.map((payment) => ({
    id: payment.id.toString(),
    subject: payment.invoice.reference,
    detail: `${payment.invoice.customer.firstName} ${payment.invoice.customer.lastName} · ${formatDate(payment.paidAt)} · ${payment.method}`,
    metric: currency.format(payment.amountPence / 100),
    status: payment.reference ?? 'No reference',
  }));

  const stockRows: ReportRow[] = inventoryItems
    .filter((item) => item.quantityOnHand <= item.reorderLevel)
    .map((item) => ({
      id: item.sku,
      subject: item.name,
      detail: `${item.sku} · ${item.supplier}`,
      metric: `${item.quantityOnHand} / ${item.reorderLevel}`,
      status: item.quantityOnHand === 0 ? 'Out of stock' : item.category,
    }));

  const technicianRows: ReportRow[] = technicians
    .map((technician) => {
      const openJobs = technician.repairJobs.filter(
        (job) => job.status !== RepairJobStatus.ReadyForCollection
      ).length;

      return {
        id: technician.id.toString(),
        subject: `${technician.firstName} ${technician.lastName}`,
        detail: `${technician.repairJobs.length} assigned repair jobs`,
        metric: String(openJobs),
        status: openJobs === 0 ? 'Available' : openJobs >= 4 ? 'Busy' : 'Assigned',
      };
    })
    .sort((left, right) => Number(right.metric) - Number(left.metric));

  const rowsByReport: Record<ReportId, ReportRow[]> = {
    'repair-status': repairRows,
    'outstanding-invoices': invoiceRows,
    'payment-history': paymentRows,
    'low-stock': stockRows,
    'technician-workload': technicianRows,
  };

  return (Object.keys(reportDefinitions) as ReportId[]).map((id) => ({
    ...reportDefinitions[id],
    rows: rowsByReport[id],
  }));
}