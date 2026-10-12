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
  { label: 'Repair Jobs', icon: IconTool },
  { label: 'Customers', icon: IconUsers, href: '/dashboard/customers' },
  { label: 'Equipment', icon: IconDeviceLaptop },
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

export const recentRepairJobs: RepairJob[] = [
  {
    reference: 'RJ-2041',
    customer: 'Sarah Mitchell',
    equipment: 'Dell XPS 15 Laptop',
    issue: 'Screen replacement',
    status: 'In Progress',
    technician: 'James Carter',
    dateReceived: '08 Oct 2026',
  },
  {
    reference: 'RJ-2042',
    customer: 'Marcus Webb',
    equipment: 'Lenovo ThinkPad X1 Carbon',
    issue: 'Laptop charging port repair',
    status: 'Awaiting Parts',
    technician: 'Dana Fields',
    dateReceived: '08 Oct 2026',
  },
  {
    reference: 'RJ-2043',
    customer: 'Priya Anand',
    equipment: 'iPhone 13',
    issue: 'Battery replacement',
    status: 'Ready for Collection',
    technician: 'James Carter',
    dateReceived: '07 Oct 2026',
  },
  {
    reference: 'RJ-2044',
    customer: 'Tom Holloway',
    equipment: 'Google Pixel 8',
    issue: 'Phone diagnostics - no power',
    status: 'Awaiting Diagnosis',
    technician: 'Liam Osei',
    dateReceived: '07 Oct 2026',
  },
  {
    reference: 'RJ-2045',
    customer: 'Grace Lin',
    equipment: 'MacBook Air M2',
    issue: 'Laptop keyboard replacement',
    status: 'Awaiting Approval',
    technician: 'Dana Fields',
    dateReceived: '06 Oct 2026',
  },
  {
    reference: 'RJ-2046',
    customer: 'Oliver Bennett',
    equipment: 'iPhone 14',
    issue: 'Phone screen replacement',
    status: 'Overdue',
    technician: 'Liam Osei',
    dateReceived: '03 Oct 2026',
  },
];

export interface Customer {
  name: string;
  email: string;
  phone: string;
  repairJobs: number;
  lastVisit: string;
}

// export const customers: Customer[] = [
//   { name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', phone: '07700 900101', repairJobs: 3, lastVisit: '08 Oct 2026' },
//   { name: 'Marcus Webb', email: 'marcus.webb@example.com', phone: '07700 900102', repairJobs: 2, lastVisit: '08 Oct 2026' },
//   { name: 'Priya Anand', email: 'priya.anand@example.com', phone: '07700 900103', repairJobs: 4, lastVisit: '07 Oct 2026' },
//   { name: 'Tom Holloway', email: 'tom.holloway@example.com', phone: '07700 900104', repairJobs: 1, lastVisit: '07 Oct 2026' },
//   { name: 'Grace Lin', email: 'grace.lin@example.com', phone: '07700 900105', repairJobs: 2, lastVisit: '06 Oct 2026' },
//   { name: 'Oliver Bennett', email: 'oliver.bennett@example.com', phone: '07700 900106', repairJobs: 1, lastVisit: '03 Oct 2026' },
//   { name: 'Noah Fischer', email: 'noah.fischer@example.com', phone: '07700 900107', repairJobs: 2, lastVisit: '01 Oct 2026' },
// ];

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

