import { Badge } from '@mantine/core';
import type { JobStatus } from './data';

const STATUS_COLORS: Record<JobStatus, string> = {
  'In Progress': 'blue',
  'Awaiting Diagnosis': 'indigo',
  'Awaiting Parts': 'yellow',
  'Awaiting Approval': 'grape',
  'Ready for Collection': 'green',
  Overdue: 'red',
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge color={STATUS_COLORS[status]} variant="light" radius="sm">
      {status}
    </Badge>
  );
}
