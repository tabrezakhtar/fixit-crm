'use client';

import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { Schedule } from '@mantine/schedule';
import type { ScheduleEventData } from '@mantine/schedule';

export function AppointmentsPage({ events }: { events: ScheduleEventData[] }) {
  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
            Workshop
          </Text>
          <Title order={2}>Appointments &amp; Schedule</Title>
        </div>
        <Badge variant="light" color="blue" size="lg">
          {events.length} appointments
        </Badge>
      </Group>

      <Schedule
        events={events}
        defaultView="week"
        layout="responsive"
        withAgenda
        dayViewProps={{ startTime: '08:00:00', endTime: '18:00:00' }}
        weekViewProps={{ startTime: '08:00:00', endTime: '18:00:00', withWeekendDays: false }}
        monthViewProps={{ firstDayOfWeek: 1 }}
      />
    </Stack>
  );
}
