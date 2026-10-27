import { cacheLife } from 'next/cache';
import 'server-only';
import { AppointmentStatus } from '../generated/prisma/client';
import { prisma } from './prisma';

const DEFAULT_APPOINTMENT_DURATION_MINUTES = 60;

const appointmentColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Confirmed]: 'blue',
  [AppointmentStatus.DropOff]: 'teal',
  [AppointmentStatus.Collection]: 'green',
};

function formatScheduleDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export async function getAppointments() {
  'use cache';
  cacheLife('hours');

  const appointments = await prisma.appointment.findMany({
    orderBy: [{ scheduledAt: 'asc' }, { id: 'asc' }],
    include: {
      customer: { select: { firstName: true, lastName: true } },
      technician: { select: { firstName: true, lastName: true } },
    },
  });

  return appointments.map((appointment) => ({
    id: appointment.id.toString(),
    title: `${appointment.customer.firstName} ${appointment.customer.lastName} · ${appointment.repairType}`,
    start: formatScheduleDate(appointment.scheduledAt),
    end: formatScheduleDate(
      new Date(appointment.scheduledAt.getTime() + DEFAULT_APPOINTMENT_DURATION_MINUTES * 60_000)
    ),
    color: appointmentColors[appointment.status],
  }));
}
