import { cacheLife } from 'next/cache';
import 'server-only';
import type { EquipmentCategory, EquipmentModel, JobStatus } from '../components/Dashboard/data';
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

function getCategory(equipment: string): EquipmentCategory {
  const name = equipment.toLowerCase();
  if (/iphone|pixel|phone|galaxy/.test(name)) {
    return 'Phone';
  }
  if (/laptop|macbook|thinkpad|xps|chromebook/.test(name)) {
    return 'Laptop';
  }
  return 'Other';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export async function getEquipmentModels(): Promise<EquipmentModel[]> {
  'use cache';
  cacheLife('hours');

  const jobs = await prisma.repairJob.findMany({
    orderBy: [{ dateReceived: 'desc' }, { id: 'desc' }],
    select: {
      reference: true,
      equipment: true,
      issue: true,
      status: true,
      dateReceived: true,
      customer: { select: { firstName: true, lastName: true } },
    },
  });

  const models = new Map<string, EquipmentModel>();
  for (const job of jobs) {
    const name = job.equipment.trim();
    const key = name.toLowerCase();
    const existing = models.get(key);
    if (existing) {
      existing.repairCount += 1;
      continue;
    }

    models.set(key, {
      name,
      category: getCategory(name),
      repairCount: 1,
      latestRepair: {
        reference: job.reference,
        customer: `${job.customer.firstName} ${job.customer.lastName}`,
        issue: job.issue,
        status: jobStatusLabels[job.status],
        dateReceived: formatDate(job.dateReceived),
      },
    });
  }

  return Array.from(models.values());
}
