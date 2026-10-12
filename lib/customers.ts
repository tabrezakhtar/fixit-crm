import 'server-only';
import { prisma } from './prisma';

const customerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  county: true,
  postcode: true,
  country: true,
  notes: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function getCustomers() {
  return prisma.customer.findMany({
    select: customerSelect,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}