import { Button, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconCalendarPlus, IconPlus, IconUserPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function DashboardWelcome({ username }: { username: string }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 5 || hour >= 21
        ? 'Welcome'
        : hour < 12
          ? 'Good morning'
          : hour < 17
            ? 'Good afternoon'
            : 'Good evening',
    );
  }, []);

  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" mb="lg">
      <Stack gap={2}>
        <Title order={2}>{greeting ? `${greeting}, ` : ''}{username}</Title>
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
