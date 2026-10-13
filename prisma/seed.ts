import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppointmentStatus, PrismaClient } from '../generated/prisma/client';
import { todaySchedule } from '../components/Dashboard/data';
import { customers, repairJobs } from './seed-data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const appointmentStatuses = {
  Confirmed: AppointmentStatus.Confirmed,
  'Drop-off': AppointmentStatus.DropOff,
  Collection: AppointmentStatus.Collection,
};

const customerIds = new Map(
  customers.map((customer) => [`${customer.firstName} ${customer.lastName}`, customer.id])
);

function getCustomerId(name: string): bigint {
  const customerId = customerIds.get(name);

  if (customerId === undefined) {
    throw new Error(`No seeded customer matches "${name}".`);
  }

  return customerId;
}

function parseReceivedDate(value: string): Date {
  const date = new Date(`${value} UTC`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid repair job date: "${value}".`);
  }

  return date;
}

function appointmentDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}

async function seed() {
  const technicianNames = Array.from(
    new Set([
      ...repairJobs.map((job) => job.technician),
      ...todaySchedule.map((appointment) => appointment.technician),
    ])
  );

  await prisma.$transaction(async (transaction) => {
    await transaction.appointment.deleteMany();
    await transaction.repairJob.deleteMany();
    await transaction.technician.deleteMany();
    await transaction.customer.deleteMany();

    await transaction.customer.createMany({ data: customers });

    await transaction.technician.createMany({
      data: technicianNames.map((name) => {
        const [firstName, ...lastNameParts] = name.split(' ');
        return { firstName, lastName: lastNameParts.join(' ') };
      }),
    });

    const technicians = await transaction.technician.findMany({
      select: { id: true, firstName: true, lastName: true },
    });
    const technicianIds = new Map(
      technicians.map((technician) => [`${technician.firstName} ${technician.lastName}`, technician.id])
    );

    await transaction.repairJob.createMany({
      data: repairJobs.map((job) => ({
        reference: job.reference,
        customerId: getCustomerId(job.customer),
        equipment: job.equipment,
        issue: job.issue,
        status: job.status,
        technicianId: technicianIds.get(job.technician),
        dateReceived: parseReceivedDate(job.dateReceived),
      })),
    });

    await transaction.appointment.createMany({
      data: todaySchedule.map((appointment) => ({
        customerId: getCustomerId(appointment.customer),
        technicianId: technicianIds.get(appointment.technician),
        scheduledAt: appointmentDate(appointment.time),
        repairType: appointment.repairType,
        status: appointmentStatuses[appointment.status],
      })),
    });
  });

  console.log(
    `Seeded ${customers.length} customers, ${technicianNames.length} technicians, ${repairJobs.length} repair jobs, and ${todaySchedule.length} appointments.`
  );
}

seed()
  .catch((error: unknown) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });