import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppointmentStatus, PrismaClient, RepairJobStatus } from '../generated/prisma/client';
import { recentRepairJobs, todaySchedule, type JobStatus } from '../components/Dashboard/data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const customers = [
  {
    id: BigInt(1),
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@example.com',
    phone: '07700 900101',
    company: 'Mitchell Design Studio',
    addressLine1: '14 Meadow Lane',
    addressLine2: 'Flat 2',
    city: 'London',
    county: 'Greater London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
    notes: 'Prefers email updates. Laptop customer since 2024.',
    isActive: true,
    createdAt: new Date('2024-03-12T10:00:00.000Z'),
    updatedAt: new Date('2026-10-08T09:30:00.000Z'),
  },
  {
    id: BigInt(2),
    firstName: 'Marcus',
    lastName: 'Webb',
    email: 'marcus.webb@example.com',
    phone: '07700 900102',
    company: 'Webb Audio Services',
    addressLine1: '28 Station Road',
    addressLine2: 'Unit 4',
    city: 'Bristol',
    county: 'Somerset',
    postcode: 'BS1 4ST',
    country: 'United Kingdom',
    notes: 'Call before ordering parts. Owns several audio devices.',
    isActive: true,
    createdAt: new Date('2023-11-05T11:15:00.000Z'),
    updatedAt: new Date('2026-10-08T14:20:00.000Z'),
  },
  {
    id: BigInt(3),
    firstName: 'Priya',
    lastName: 'Anand',
    email: 'priya.anand@example.com',
    phone: '07700 900103',
    company: 'Anand Consulting Ltd',
    addressLine1: '6 Orchard Street',
    addressLine2: 'Floor 3',
    city: 'Manchester',
    county: 'Greater Manchester',
    postcode: 'M1 1AD',
    country: 'United Kingdom',
    notes: 'Available for collections after 10:00.',
    isActive: true,
    createdAt: new Date('2024-06-21T08:45:00.000Z'),
    updatedAt: new Date('2026-10-07T16:05:00.000Z'),
  },
  {
    id: BigInt(4),
    firstName: 'Tom',
    lastName: 'Holloway',
    email: 'tom.holloway@example.com',
    phone: '07700 900104',
    company: 'Holloway Property Group',
    addressLine1: '91 King Street',
    addressLine2: 'Building B',
    city: 'Leeds',
    county: 'West Yorkshire',
    postcode: 'LS1 2HH',
    country: 'United Kingdom',
    notes: 'Requested a call with diagnostic results before repair work.',
    isActive: true,
    createdAt: new Date('2025-01-17T13:30:00.000Z'),
    updatedAt: new Date('2026-10-07T10:10:00.000Z'),
  },
  {
    id: BigInt(5),
    firstName: 'Grace',
    lastName: 'Lin',
    email: 'grace.lin@example.com',
    phone: '07700 900105',
    company: 'Lin Creative',
    addressLine1: '3 Riverside Walk',
    addressLine2: 'Apartment 12',
    city: 'Cambridge',
    county: 'Cambridgeshire',
    postcode: 'CB2 1TN',
    country: 'United Kingdom',
    notes: 'Quote must be approved before repairs begin.',
    isActive: true,
    createdAt: new Date('2024-09-02T09:20:00.000Z'),
    updatedAt: new Date('2026-10-06T15:40:00.000Z'),
  },
  {
    id: BigInt(6),
    firstName: 'Oliver',
    lastName: 'Bennett',
    email: 'oliver.bennett@example.com',
    phone: '07700 900106',
    company: 'Bennett & Co',
    addressLine1: '42 Park View',
    addressLine2: 'Suite 5',
    city: 'Oxford',
    county: 'Oxfordshire',
    postcode: 'OX1 1BP',
    country: 'United Kingdom',
    notes: 'Contact by phone when repair is ready for collection.',
    isActive: true,
    createdAt: new Date('2023-07-28T14:00:00.000Z'),
    updatedAt: new Date('2026-10-03T12:25:00.000Z'),
  },
  {
    id: BigInt(7),
    firstName: 'Noah',
    lastName: 'Fischer',
    email: 'noah.fischer@example.com',
    phone: '07700 900107',
    company: 'Fischer Engineering',
    addressLine1: '17 Mill Road',
    addressLine2: 'Workshop 2',
    city: 'Nottingham',
    county: 'Nottinghamshire',
    postcode: 'NG1 5FS',
    country: 'United Kingdom',
    notes: 'PC diagnostics appointment requested.',
    isActive: true,
    createdAt: new Date('2025-04-10T07:50:00.000Z'),
    updatedAt: new Date('2026-10-01T11:00:00.000Z'),
  },
];

const jobStatuses = {
  'In Progress': RepairJobStatus.InProgress,
  'Awaiting Diagnosis': RepairJobStatus.AwaitingDiagnosis,
  'Awaiting Parts': RepairJobStatus.AwaitingParts,
  'Awaiting Approval': RepairJobStatus.AwaitingApproval,
  'Ready for Collection': RepairJobStatus.ReadyForCollection,
  Overdue: RepairJobStatus.Overdue,
} satisfies Record<JobStatus, RepairJobStatus>;

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
      ...recentRepairJobs.map((job) => job.technician),
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
      data: recentRepairJobs.map((job) => ({
        reference: job.reference,
        customerId: getCustomerId(job.customer),
        equipment: job.equipment,
        issue: job.issue,
        status: jobStatuses[job.status],
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
    `Seeded ${customers.length} customers, ${technicianNames.length} technicians, ${recentRepairJobs.length} repair jobs, and ${todaySchedule.length} appointments.`
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