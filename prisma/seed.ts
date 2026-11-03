import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { todaySchedule } from '../components/Dashboard/data';
import { AppointmentStatus, PrismaClient } from '../generated/prisma/client';
import { customers, quotes, repairJobs } from './seed-data';
import { createSeedDateShifter } from './seed-date';

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

function parseSeedDate(value: string): Date {
  const date = new Date(`${value} UTC`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid seed date: "${value}".`);
  }

  return date;
}

const seedDates = [
  ...customers.flatMap((customer) => [customer.createdAt, customer.updatedAt]),
  ...repairJobs.map((job) => parseSeedDate(job.dateReceived)),
  ...quotes.map((quote) => parseSeedDate(quote.issuedAt)),
];
const shiftSeedDateToToday = createSeedDateShifter(seedDates);

function appointmentDate(time: string, daysFromToday = 0): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
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
    await transaction.quote.deleteMany();
    await transaction.repairJob.deleteMany();
    await transaction.technician.deleteMany();
    await transaction.customer.deleteMany();

    await transaction.customer.createMany({
      data: customers.map((customer) => ({
        ...customer,
        createdAt: shiftSeedDateToToday(customer.createdAt),
        updatedAt: shiftSeedDateToToday(customer.updatedAt),
      })),
    });

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
      technicians.map((technician) => [
        `${technician.firstName} ${technician.lastName}`,
        technician.id,
      ])
    );

    await transaction.repairJob.createMany({
      data: repairJobs.map((job) => ({
        reference: job.reference,
        customerId: getCustomerId(job.customer),
        equipment: job.equipment,
        issue: job.issue,
        status: job.status,
        technicianId: technicianIds.get(job.technician),
        dateReceived: shiftSeedDateToToday(parseSeedDate(job.dateReceived)),
      })),
    });

    const seededRepairJobs = await transaction.repairJob.findMany({
      select: { id: true, reference: true },
    });
    const repairJobIds = new Map(seededRepairJobs.map((job) => [job.reference, job.id]));

    await transaction.quote.createMany({
      data: quotes.map((quote) => ({
        reference: quote.reference,
        customerId: getCustomerId(quote.customer),
        repairJobId: repairJobIds.get(quote.repairJob),
        status: quote.status,
        issuedAt: shiftSeedDateToToday(parseSeedDate(quote.issuedAt)),
        validUntil: shiftSeedDateToToday(parseSeedDate(quote.validUntil)),
      })),
    });

    const seededQuotes = await transaction.quote.findMany({
      select: { id: true, reference: true },
    });
    const quoteIds = new Map(seededQuotes.map((quote) => [quote.reference, quote.id]));

    await transaction.quoteItem.createMany({
      data: quotes.flatMap((quote) =>
        quote.items.map((item) => ({
          quoteId: quoteIds.get(quote.reference)!,
          ...item,
        }))
      ),
    });

    await transaction.appointment.createMany({
      data: todaySchedule.map((appointment) => ({
        customerId: getCustomerId(appointment.customer),
        technicianId: technicianIds.get(appointment.technician),
        scheduledAt: appointmentDate(appointment.time, appointment.daysFromToday),
        repairType: appointment.repairType,
        status: appointmentStatuses[appointment.status],
      })),
    });
  });

  process.stdout.write(
    `Seeded ${customers.length} customers, ${technicianNames.length} technicians, ${repairJobs.length} repair jobs, ${quotes.length} quotes, and ${todaySchedule.length} appointments.\n`
  );
}

seed()
  .catch((error: unknown) => {
    process.stderr.write(
      `Database seed failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
