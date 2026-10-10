import { ActionIcon, Anchor, Card, Group, Select, Table, Text, TextInput } from '@mantine/core';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import { recentRepairJobs } from './data';
import { StatusBadge } from './StatusBadge';

export function RecentRepairJobsTable() {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <Text fw={600}>Recent Repair Jobs</Text>
        <Anchor size="sm" href="#">
          View all
        </Anchor>
      </Group>

      <Group mb="md" gap="sm">
        <TextInput
          placeholder="Search jobs..."
          leftSection={<IconSearch size={16} />}
          size="xs"
          radius="md"
          style={{ flex: 1 }}
        />
        <Select
          data={['All statuses', 'In Progress', 'Awaiting Parts', 'Awaiting Approval', 'Ready for Collection']}
          defaultValue="All statuses"
          size="xs"
          radius="md"
          w={190}
        />
      </Group>

      <div style={{ overflowX: 'auto' }}>
        <Table verticalSpacing="sm" highlightOnHover miw={700}>
          <thead>
            <tr>
              <th>Job Reference</th>
              <th>Customer</th>
              <th>Equipment</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Date Received</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recentRepairJobs.map((job) => (
              <tr key={job.reference}>
                <td>
                  <Text size="sm" fw={600}>
                    {job.reference}
                  </Text>
                </td>
                <td>{job.customer}</td>
                <td>{job.equipment}</td>
                <td>{job.issue}</td>
                <td>
                  <StatusBadge status={job.status} />
                </td>
                <td>{job.technician}</td>
                <td>{job.dateReceived}</td>
                <td>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
