'use client';

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconFileText,
  IconPackage,
} from '@tabler/icons-react';
import { Card, Center, Group, Loader, Stack, Text, ThemeIcon } from '@mantine/core';
import type { AttentionItem, JobStatus } from './data';

const ICONS: Record<JobStatus, typeof IconAlertTriangle> = {
  Overdue: IconAlertTriangle,
  'Awaiting Diagnosis': IconClock,
  'Awaiting Approval': IconFileText,
  'Awaiting Parts': IconPackage,
  'Ready for Collection': IconCircleCheck,
  'In Progress': IconClock,
};

const COLORS: Record<JobStatus, string> = {
  Overdue: 'red',
  'Awaiting Diagnosis': 'indigo',
  'Awaiting Approval': 'grape',
  'Awaiting Parts': 'yellow',
  'Ready for Collection': 'green',
  'In Progress': 'blue',
};

export function AttentionRequired({
  items,
  loading,
}: {
  items: AttentionItem[];
  loading: boolean;
}) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Text fw={600} mb="md">
        Jobs Requiring Attention
      </Text>
      {loading ? (
        <Center h={180}>
          <Loader size="sm" aria-label="Loading jobs requiring attention" />
        </Center>
      ) : (
        <Stack gap="sm">
          {items.length === 0 ? (
            <Text size="sm" c="dimmed">
              No jobs currently need attention.
            </Text>
          ) : (
            items.map((item) => {
              const Icon = ICONS[item.status];
              return (
                <Group key={item.reference} wrap="nowrap" align="flex-start">
                  <ThemeIcon color={COLORS[item.status]} variant="light" size={32} radius="md">
                    <Icon size={16} stroke={1.8} />
                  </ThemeIcon>
                  <div style={{ flex: 1 }}>
                    <Group justify="space-between" gap={4}>
                      <Text size="sm" fw={600}>
                        {item.reference} · {item.customer}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {item.description}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {item.due}
                    </Text>
                  </div>
                </Group>
              );
            })
          )}
        </Stack>
      )}
    </Card>
  );
}
