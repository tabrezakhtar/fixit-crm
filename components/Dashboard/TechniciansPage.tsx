'use client';

import { useState } from 'react';
import { IconCalendarEvent, IconSearch } from '@tabler/icons-react';
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

      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
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
                padding="lg"
              >
                <Card.Section inheritPadding py="md" className={classes.identitySection}>
                  <Group justify="space-between" wrap="nowrap" align="center">
                    <Group wrap="nowrap" align="center" gap="sm">
                      <Avatar
                        name={technician.name}
                        color="initials"
                        radius="xl"
                        size={48}
                        aria-label={`${technician.name} avatar`}
                      />
                      <div>
                        <Text size="md" fw={700}>
                          {technician.name}
                        </Text>
                        <Text size="xs" className={classes.secondaryText}>
                          Technician
                        </Text>
                      </div>
                    </Group>
                    <Badge
                      variant="light"
                      color={technician.isActive ? 'green' : 'gray'}
                      size="sm"
                    >
                      {technician.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>
                </Card.Section>

                <Card.Section inheritPadding py="sm" className={classes.workloadSection}>
                  <Group justify="space-between" align="center">
                    <Text size="sm" fw={600}>
                      Current workload
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
                      size="md"
                    >
                      {workloadLabel(technician.openJobs)}
                    </Badge>
                  </Group>
                </Card.Section>

                <Card.Section inheritPadding py="md" className={classes.metricsSection}>
                  <SimpleGrid cols={3} spacing={0}>
                    <div className={classes.metric}>
                      <Text size="xs" className={classes.secondaryText}>
                        Open repairs
                      </Text>
                      <Text size="xl" fw={700}>
                        {technician.openJobs}
                      </Text>
                    </div>
                    <div className={classes.metric}>
                      <Text size="xs" className={classes.secondaryText}>
                        Assigned
                      </Text>
                      <Text size="xl" fw={700}>
                        {technician.repairJobs}
                      </Text>
                    </div>
                    <div className={classes.metric}>
                      <Text size="xs" className={classes.secondaryText}>
                        Overdue
                      </Text>
                      <Text size="xl" fw={700} c={technician.overdueJobs > 0 ? 'red.7' : undefined}>
                        {technician.overdueJobs}
                      </Text>
                    </div>
                  </SimpleGrid>
                </Card.Section>

                <Card.Section inheritPadding py="sm" className={classes.appointmentsSection}>
                  <Group gap="xs" c="dimmed">
                    <IconCalendarEvent size={16} aria-hidden="true" />
                    <Text size="sm" fw={500}>
                      {technician.appointments} appointments
                    </Text>
                  </Group>
                </Card.Section>
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
      </Stack>
    </Stack>
  );
}