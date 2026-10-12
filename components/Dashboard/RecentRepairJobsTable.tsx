'use client';

import { ActionIcon, Anchor, Card, Center, Group, Loader, Select, Table, Text, TextInput } from '@mantine/core';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import type { RepairJob } from './data';
import { StatusBadge } from './StatusBadge';
import classes from './DataTable.module.css';

export function RecentRepairJobsTable({ jobs, loading }: { jobs: RepairJob[]; loading: boolean }) {
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

      <div className={classes.scrollContainer}>
        {loading ? (
          <Center h={220}><Loader size="sm" aria-label="Loading repair jobs" /></Center>
        ) : (
        <Table
          className={classes.repairTable}
          horizontalSpacing="lg"
          verticalSpacing="md"
          highlightOnHover
        >
          <thead>
            <tr>
              <th className={classes.headerCell}>Job Reference</th>
              <th className={classes.headerCell}>Customer</th>
              <th className={classes.headerCell}>Equipment</th>
              <th className={classes.headerCell}>Issue</th>
              <th className={classes.headerCell}>Status</th>
              <th className={classes.headerCell}>Technician</th>
              <th className={classes.headerCell}>Date Received</th>
              <th className={classes.headerCell} />
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td className={classes.cell} colSpan={8}>
                  <Text size="sm" c="dimmed" ta="center">No repair jobs found.</Text>
                </td>
              </tr>
            ) : jobs.map((job) => (
              <tr key={job.reference}>
                <td className={classes.cell}>
                  <Text size="sm" fw={600}>
                    {job.reference}
                  </Text>
                </td>
                <td className={classes.cell}>{job.customer}</td>
                <td className={classes.cell}>{job.equipment}</td>
                <td className={classes.cell}>{job.issue}</td>
                <td className={classes.cell}>
                  <StatusBadge status={job.status} />
                </td>
                <td className={classes.cell}>{job.technician}</td>
                <td className={classes.cell}>{job.dateReceived}</td>
                <td className={classes.cell}>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      </div>
    </Card>
  );
}
