import { cacheLife } from 'next/cache';
import 'server-only';
import type { TechnicianListItem } from '../components/Dashboard/data';
import { RepairJobStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

export async function getTechnicians(): Promise<TechnicianListItem[]> {
  'use cache';
  cacheLife('hours');

  const technicians = await prisma.technician.findMany({
    orderBy: [{ isActive: 'desc' }, { lastName: 'asc' }, { firstName: 'asc' }],
    include: {
      repairJobs: { select: { status: true } },
      appointments: { select: { id: true } },
    },
  });

  return technicians.map((technician) => {
    const openJobs = technician.repairJobs.filter(
      (job) => job.status !== RepairJobStatus.ReadyForCollection
    ).length;

    return {
      id: technician.id.toString(),
      name: `${technician.firstName} ${technician.lastName}`,
      isActive: technician.isActive,
      repairJobs: technician.repairJobs.length,
      openJobs,
      overdueJobs: technician.repairJobs.filter((job) => job.status === RepairJobStatus.Overdue)
        .length,
      appointments: technician.appointments.length,
    };
  });
}