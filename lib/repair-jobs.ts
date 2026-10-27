import { cacheLife } from 'next/cache';
import 'server-only';
import type { JobStatus, RepairJobListItem } from '../components/Dashboard/data';
import { RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

const jobStatusLabels: Record<RepairJobStatus, JobStatus> = {
  [RepairJobStatus.InProgress]: 'In Progress',
  [RepairJobStatus.AwaitingDiagnosis]: 'Awaiting Diagnosis',
  [RepairJobStatus.AwaitingParts]: 'Awaiting Parts',
  [RepairJobStatus.AwaitingApproval]: 'Awaiting Approval',
  [RepairJobStatus.ReadyForCollection]: 'Ready for Collection',
  [RepairJobStatus.Overdue]: 'Overdue',
};

export async function getRepairJobs(): Promise<RepairJobListItem[]> {
  'use cache';
  cacheLife('hours');

  const jobs = await prisma.repairJob.findMany({
    orderBy: [{ dateReceived: 'desc' }, { id: 'desc' }],
    include: {
      customer: { select: { firstName: true, lastName: true, email: true } },
      technician: { select: { firstName: true, lastName: true } },
    },
  });

  return jobs.map((job) => ({
    reference: job.reference,
    customer: `${job.customer.firstName} ${job.customer.lastName}`,
    customerEmail: job.customer.email,
    equipment: job.equipment,
    issue: job.issue,
    status: jobStatusLabels[job.status],
    technician: job.technician
      ? `${job.technician.firstName} ${job.technician.lastName}`
      : 'Unassigned',
    dateReceived: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(job.dateReceived),
  }));
}
