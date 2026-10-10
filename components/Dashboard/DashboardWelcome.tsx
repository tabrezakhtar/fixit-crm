import { Button, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconCalendarPlus, IconPlus, IconUserPlus } from '@tabler/icons-react';

export function DashboardWelcome() {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" mb="lg">
      <Stack gap={2}>
        <Title order={2}>Good morning, Alex</Title>
        <Text c="dimmed" size="sm">
          Here&apos;s what&apos;s happening at your workshop today.
        </Text>
      </Stack>
      <Group gap="sm" wrap="wrap">
        <Select data={['Today', 'This week', 'This month']} defaultValue="Today" radius="md" w={140} />
        <Button variant="default" leftSection={<IconUserPlus size={16} />} radius="md">
          Add Customer
        </Button>
        <Button variant="default" leftSection={<IconCalendarPlus size={16} />} radius="md">
          Schedule Appointment
        </Button>
        <Button leftSection={<IconPlus size={16} />} radius="md">
          New Repair Job
        </Button>
      </Group>
    </Group>
  );
}
