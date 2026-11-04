'use client';

import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import type { TechnicianListItem } from './data';
import classes from './TechniciansPage.module.css';

const availabilityFilters = [
  { label: 'All technicians', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

function workloadLabel(openJobs: number): string {
  if (openJobs === 0) return 'Available';
  if (openJobs >= 4) return 'Busy';
  return 'Assigned';
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function TechniciansPage({ technicians }: { technicians: TechnicianListItem[] }) {
  const [query, setQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredTechnicians = technicians.filter((technician) => {
    const matchesQuery = technician.name.toLowerCase().includes(normalizedQuery);
    const matchesAvailability =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'active' ? technician.isActive : !technician.isActive);

    return matchesQuery && matchesAvailability;
  });
  const activeTechnicians = technicians.filter((technician) => technician.isActive).length;
  const availableTechnicians = technicians.filter(
    (technician) => technician.isActive && technician.openJobs === 0
  ).length;
  const openJobs = technicians.reduce((total, technician) => total + technician.openJobs, 0);
  const overdueJobs = technicians.reduce((total, technician) => total + technician.overdueJobs, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Technicians
          </Text>
          <Text size="sm" c="dimmed">
            Team availability, repair workload, and scheduled appointments
          </Text>
        </div>
        <Text size="sm" c="dimmed">
          {technicians.length} team members
        </Text>
      </Group>

      <Group grow align="stretch">
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Active technicians
          </Text>
          <Text size="xl" fw={700}>
            {activeTechnicians}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Available
          </Text>
          <Text size="xl" fw={700} c="green.7">
            {availableTechnicians}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Open repairs
          </Text>
          <Text size="xl" fw={700}>
            {openJobs}
          </Text>
        </Card>
        <Card withBorder radius="sm" padding="md">
          <Text size="xs" c="dimmed">
            Overdue repairs
          </Text>
          <Text size="xl" fw={700} c="red.7">
            {overdueJobs}
          </Text>
        </Card>
      </Group>

      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600}>Team roster</Text>
            <Text size="xs" c="dimmed">
              Showing {filteredTechnicians.length} of {technicians.length}
            </Text>
          </div>
          <Group w={{ base: '100%', sm: 'auto' }} grow>
            <TextInput
              aria-label="Search technicians"
              placeholder="Search technicians..."
              leftSection={<IconSearch size={16} />}
              size="xs"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              w={{ base: '100%', sm: 260 }}
            />
            <SegmentedControl
              aria-label="Filter technicians by availability"
              data={availabilityFilters}
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              size="xs"
            />
          </Group>
        </Group>

        {filteredTechnicians.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
            {filteredTechnicians.map((technician) => (
              <Card
                key={technician.id}
                className={classes.technicianCard}
                withBorder
                radius="sm"
                padding="md"
              >
                <Stack gap="md">
                  <Group justify="space-between" wrap="nowrap" align="flex-start">
                    <Group wrap="nowrap" align="center">
                      <Avatar color={technician.isActive ? 'blue' : 'gray'} radius="xl" size="lg">
                        {initials(technician.name)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={600}>
                          {technician.name}
                        </Text>
                        <Text size="xs" className={classes.secondaryText}>
                          {technician.isActive ? 'Active technician' : 'Inactive technician'}
                        </Text>
                      </div>
                    </Group>
                    <Badge variant="light" color={technician.isActive ? 'green' : 'gray'}>
                      {technician.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" className={classes.secondaryText}>
                      Workload
                    </Text>
                    <Badge
                      variant="light"
                      color={
                        technician.openJobs === 0
                          ? 'green'
                          : technician.openJobs >= 4
                            ? 'orange'
                            : 'blue'
                      }
                    >
                      {workloadLabel(technician.openJobs)}
                    </Badge>
                  </Group>

                  <Group grow>
                    <div>
                      <Text size="xs" className={classes.secondaryText}>
                        Open repairs
                      </Text>
                      <Text size="md" fw={700}>
                        {technician.openJobs}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" className={classes.secondaryText}>
                        Assigned
                      </Text>
                      <Text size="md" fw={700}>
                        {technician.repairJobs}
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" className={classes.secondaryText}>
                        Overdue
                      </Text>
                      <Text
                        size="md"
                        fw={700}
                        c={technician.overdueJobs > 0 ? 'red.7' : undefined}
                      >
                        {technician.overdueJobs}
                      </Text>
                    </div>
                  </Group>

                  <Text size="xs" className={classes.secondaryText}>
                    {technician.appointments} appointments
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text ta="center" c="dimmed" py="lg">
            {technicians.length === 0
              ? 'No technicians found.'
              : 'No technicians match your filters.'}
          </Text>
        )}
      </Card>
    </Stack>
  );
}