'use client';

import { Card, Group, Select, SimpleGrid, Stack, Table, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { dashboardStatusCards, type JobStatus, type RepairJobListItem } from './data';
import { StatusBadge } from './StatusBadge';
import classes from './DataTable.module.css';

const statuses: JobStatus[] = [
  'In Progress',
  'Awaiting Diagnosis',
  'Awaiting Parts',
  'Awaiting Approval',
  'Ready for Collection',
  'Overdue',
];

export function RepairJobsPage({ jobs }: { jobs: RepairJobListItem[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    const matchesQuery = Object.values(job).some((value) => value.toLowerCase().includes(normalizedQuery));
    return matchesQuery && (!statusFilter || job.status === statusFilter);
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>Repair Jobs</Text>
          <Text size="sm" c="dimmed">Track repairs, assignments, and job status</Text>
        </div>
        <Text size="sm" c="dimmed">{jobs.length} total jobs</Text>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }}>
        {dashboardStatusCards.map(({ label, status, color }) => {
          const count = jobs.filter((job) => job.status === status).length;
          return (
            <Card key={status} withBorder radius="sm" padding="md">
              <Text size="xs" c="dimmed" lineClamp={1}>{label}</Text>
              <Text size="xl" fw={700} c={`${color}.7`}>{count}</Text>
            </Card>
          );
        })}
      </SimpleGrid>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>All repair jobs</Text>
            <Text size="xs" c="dimmed">Showing {filteredJobs.length} of {jobs.length}</Text>
          </div>
          <Group w={{ base: '100%', sm: 'auto' }} grow>
            <TextInput
              aria-label="Search repair jobs"
              placeholder="Search jobs..."
              leftSection={<IconSearch size={16} />}
              size="xs"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              w={{ base: '100%', sm: 230 }}
            />
            <Select
              aria-label="Filter by status"
              placeholder="All statuses"
              data={statuses}
              clearable
              size="xs"
              value={statusFilter}
              onChange={setStatusFilter}
              w={{ base: '100%', sm: 190 }}
            />
          </Group>
        </Group>

        <div className={classes.scrollContainer}>
          <Table className={classes.repairTable} horizontalSpacing="md" verticalSpacing="sm" highlightOnHover>
            <thead>
              <tr>
                <th className={classes.headerCell}>Reference</th>
                <th className={classes.headerCell}>Customer</th>
                <th className={classes.headerCell}>Equipment</th>
                <th className={classes.headerCell}>Issue</th>
                <th className={classes.headerCell}>Status</th>
                <th className={classes.headerCell}>Technician</th>
                <th className={classes.headerCell}>Received</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.reference}>
                    <td className={classes.cell}>{job.reference}</td>
                    <td className={classes.cell}>
                      <Text size="sm" fw={600}>{job.customer}</Text>
                      <Text size="xs" c="dimmed">{job.customerEmail}</Text>
                    </td>
                    <td className={classes.cell}>{job.equipment}</td>
                    <td className={classes.cell}><Text size="sm" lineClamp={2}>{job.issue}</Text></td>
                    <td className={classes.cell}><StatusBadge status={job.status} /></td>
                    <td className={classes.cell}>{job.technician}</td>
                    <td className={classes.cell}>{job.dateReceived}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <Text ta="center" c="dimmed" py="lg">
                      {jobs.length === 0 ? 'No repair jobs found.' : 'No repair jobs match your filters.'}
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Stack>
  );
}