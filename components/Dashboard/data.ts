import {
  IconBox,
  IconCalendarEvent,
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDeviceLaptop,
  IconFileInvoice,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react';

export type JobStatus =
  | 'In Progress'
  | 'Awaiting Diagnosis'
  | 'Awaiting Parts'
  | 'Awaiting Approval'
  | 'Ready for Collection'
  | 'Overdue';

export interface NavItem {
  label: string;
  icon: typeof IconDashboard;
  href?: string;
  active?: boolean;
}

export const primaryNavItems: NavItem[] = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Repair Jobs', icon: IconTool, href: '/dashboard/repair-jobs' },
  { label: 'Customers', icon: IconUsers, href: '/dashboard/customers' },
  { label: 'Equipment', icon: IconDeviceLaptop, href: '/dashboard/equipment' },
  { label: 'Appointments & Schedule', icon: IconCalendarEvent },
  { label: 'Quotes & Estimates', icon: IconFileInvoice },
  { label: 'Parts & Inventory', icon: IconBox },
  { label: 'Invoices & Payments', icon: IconCreditCard },
  { label: 'Technicians', icon: IconUserCog },
  { label: 'Reports', icon: IconChartBar },
];

export const secondaryNavItems: NavItem[] = [{ label: 'Settings', icon: IconSettings }];

export interface SummaryCardData {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  color: string;
  icon: string;
}

export const dashboardStatusCards: Array<{
  label: string;
  status: JobStatus;
  color: string;
  icon: string;
}> = [
  { label: 'Jobs In Progress', status: 'In Progress', color: 'blue', icon: 'tool' },
  { label: 'Awaiting Diagnosis', status: 'Awaiting Diagnosis', color: 'indigo', icon: 'stethoscope' },
  { label: 'Awaiting Parts', status: 'Awaiting Parts', color: 'yellow', icon: 'box' },
  { label: 'Awaiting Approval', status: 'Awaiting Approval', color: 'grape', icon: 'approval' },
  { label: 'Ready for Collection', status: 'Ready for Collection', color: 'green', icon: 'check' },
  { label: 'Overdue Jobs', status: 'Overdue', color: 'red', icon: 'alert' },
];

export interface ChartDay {
  day: string;
  created: number;
  readyForCollection: number;
}

export interface RepairJob {
  reference: string;
  customer: string;
  equipment: string;
  issue: string;
  status: JobStatus;
  technician: string;
  dateReceived: string;
}

export interface RepairJobListItem extends RepairJob {
  customerEmail: string;
}

export type EquipmentCategory = 'Laptop' | 'Phone' | 'Other';

export interface EquipmentModel {
  name: string;
  category: EquipmentCategory;
  repairCount: number;
  latestRepair: {
    reference: string;
    customer: string;
    issue: string;
    status: JobStatus;
    dateReceived: string;
  };
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  repairJobs: number;
  lastVisit: string;
}

export interface AttentionItem {
  reference: string;
  customer: string;
  description: string;
  status: JobStatus;
  due: string;
}

export interface ScheduleItem {
  time: string;
  customer: string;
  repairType: string;
  technician: string;
  status: 'Confirmed' | 'Drop-off' | 'Collection';
}

export const todaySchedule: ScheduleItem[] = [
  { time: '09:00', customer: 'Sarah Mitchell', repairType: 'Laptop drop-off', technician: 'James Carter', status: 'Drop-off' },
  { time: '10:30', customer: 'Priya Anand', repairType: 'Phone collection', technician: 'James Carter', status: 'Collection' },
  { time: '11:15', customer: 'Noah Fischer', repairType: 'PC diagnostic review', technician: 'Liam Osei', status: 'Confirmed' },
  { time: '13:00', customer: 'Grace Lin', repairType: 'Quote approval meeting', technician: 'Dana Fields', status: 'Confirmed' },
  { time: '15:30', customer: 'Marcus Webb', repairType: 'Amplifier drop-off', technician: 'Dana Fields', status: 'Drop-off' },
];

