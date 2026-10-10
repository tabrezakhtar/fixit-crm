import { Avatar, Breadcrumbs, Button, Group, Indicator, Text, TextInput } from '@mantine/core';
import { IconBell, IconChevronRight, IconPlus, IconSearch } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import classes from './DashboardHeader.module.css';

export function DashboardHeader({ burger }: { burger?: ReactNode }) {
  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="md" wrap="nowrap">
        {burger}
        <div>
          <Text fw={700} size="lg">
            Dashboard
          </Text>
          <Breadcrumbs separator={<IconChevronRight size={12} />} className={classes.breadcrumbs}>
            <Text size="xs" c="dimmed">
              Home
            </Text>
            <Text size="xs" c="dimmed">
              Dashboard
            </Text>
          </Breadcrumbs>
        </div>
      </Group>

      <Group gap="sm" wrap="nowrap" className={classes.actions}>
        <TextInput
          placeholder="Search jobs, customers, equipment..."
          leftSection={<IconSearch size={16} />}
          className={classes.search}
          radius="md"
        />
        <Indicator color="red" size={8} offset={4}>
          <IconBell size={20} stroke={1.6} />
        </Indicator>
        <Avatar color="blue" radius="xl">
          AM
        </Avatar>
        <Button leftSection={<IconPlus size={16} />} radius="md">
          New Repair Job
        </Button>
      </Group>
    </Group>
  );
}
