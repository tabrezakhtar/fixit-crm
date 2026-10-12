import 'server-only';
import { AppointmentStatus, RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';
import { dashboardStatusCards } from '../components/Dashboard/data';
import type {
  AttentionItem,
  ChartDay,
  JobStatus,
  RepairJob,
  ScheduleItem,
  SummaryCardData,
} from '../components/Dashboard/data';

const jobStatusLabels: Record<RepairJobStatus, JobStatus> = {
  [RepairJobStatus.InProgress]: 'In Progress',
  [RepairJobStatus.AwaitingDiagnosis]: 'Awaiting Diagnosis',
  [RepairJobStatus.AwaitingParts]: 'Awaiting Parts',
  [RepairJobStatus.AwaitingApproval]: 'Awaiting Approval',
  [RepairJobStatus.ReadyForCollection]: 'Ready for Collection',
  [RepairJobStatus.Overdue]: 'Overdue',
};

const appointmentStatusLabels: Record<AppointmentStatus, ScheduleItem['status']> = {
  [AppointmentStatus.Confirmed]: 'Confirmed',
  [AppointmentStatus.DropOff]: 'Drop-off',
  [AppointmentStatus.Collection]: 'Collection',
};

const jobStatusValues: Record<JobStatus, RepairJobStatus> = {
  'In Progress': RepairJobStatus.InProgress,
  'Awaiting Diagnosis': RepairJobStatus.AwaitingDiagnosis,
  'Awaiting Parts': RepairJobStatus.AwaitingParts,
  'Awaiting Approval': RepairJobStatus.AwaitingApproval,
  'Ready for Collection': RepairJobStatus.ReadyForCollection,
  Overdue: RepairJobStatus.Overdue,
};

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export async function getDashboardData() {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);
  const chartStart = new Date(todayStart);
  chartStart.setUTCDate(chartStart.getUTCDate() - 6);

  const [statusCounts, recentRows, attentionRows, scheduleRows, chartRows] = await Promise.all([
    prisma.repairJob.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.repairJob.findMany({
      take: 8,
      orderBy: [{ dateReceived: 'desc' }, { id: 'desc' }],
      include: {
        customer: { select: { firstName: true, lastName: true } },
        technician: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.repairJob.findMany({
      where: { status: { not: RepairJobStatus.InProgress } },
      take: 5,
      orderBy: [{ dateReceived: 'asc' }, { id: 'asc' }],
      include: { customer: { select: { firstName: true, lastName: true } } },
    }),
    prisma.appointment.findMany({
      where: { scheduledAt: { gte: todayStart, lt: tomorrowStart } },
      orderBy: { scheduledAt: 'asc' },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        technician: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.repairJob.findMany({
      where: { dateReceived: { gte: chartStart, lt: tomorrowStart } },
      select: { dateReceived: true, status: true },
    }),
  ]);

  const counts = new Map(statusCounts.map(({ status, _count }) => [status, _count._all]));
  const summaryCards: SummaryCardData[] = dashboardStatusCards.map(({ label, status, color, icon }) => ({
    label,
    value: String(counts.get(jobStatusValues[status]) ?? 0),
    delta: 'Current jobs',
    trend: 'flat',
    color,
    icon,
  }));

  const chartBuckets = new Map<string, { created: number; ready: number }>();
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(chartStart);
    date.setUTCDate(chartStart.getUTCDate() + offset);
    chartBuckets.set(utcDateKey(date), { created: 0, ready: 0 });
  }
  for (const job of chartRows) {
    const bucket = chartBuckets.get(utcDateKey(job.dateReceived));
    if (!bucket) continue;
    bucket.created += 1;
    if (job.status === RepairJobStatus.ReadyForCollection) bucket.ready += 1;
  }

  const chart: ChartDay[] = Array.from(chartBuckets, ([day, values]) => ({
    day: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(
      new Date(`${day}T00:00:00.000Z`)
    ),
    created: values.created,
    readyForCollection: values.ready,
  }));

  const recentRepairJobs: RepairJob[] = recentRows.map((job) => ({
    reference: job.reference,
    customer: `${job.customer.firstName} ${job.customer.lastName}`,
    equipment: job.equipment,
    issue: job.issue,
    status: jobStatusLabels[job.status],
    technician: job.technician ? `${job.technician.firstName} ${job.technician.lastName}` : 'Unassigned',
    dateReceived: formatDate(job.dateReceived),
  }));

  const attentionItems: AttentionItem[] = attentionRows.map((job) => ({
    reference: job.reference,
    customer: `${job.customer.firstName} ${job.customer.lastName}`,
    description: job.issue,
    status: jobStatusLabels[job.status],
    due: `Received ${formatDate(job.dateReceived)}`,
  }));

  const todaySchedule: ScheduleItem[] = scheduleRows.map((appointment) => ({
    time: new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'UTC',
    }).format(appointment.scheduledAt),
    customer: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
    repairType: appointment.repairType,
    technician: appointment.technician
      ? `${appointment.technician.firstName} ${appointment.technician.lastName}`
      : 'Unassigned',
    status: appointmentStatusLabels[appointment.status],
  }));

  return { summaryCards, chart, attentionItems, recentRepairJobs, todaySchedule };
}