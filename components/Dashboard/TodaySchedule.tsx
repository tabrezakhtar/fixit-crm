import { Badge, Card, Group, Stack, Text } from '@mantine/core';
import type { ScheduleItem } from './data';
import classes from './TodaySchedule.module.css';

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'blue',
  'Drop-off': 'teal',
  Collection: 'green',
};

export function TodaySchedule({ items }: { items: ScheduleItem[] }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Text fw={600} mb="md">
        Today&apos;s Schedule
      </Text>
      <Stack gap={0} className={classes.timeline}>
        {items.length === 0 ? (
          <Text size="sm" c="dimmed">No appointments scheduled today.</Text>
        ) : items.map((item) => (
          <Group key={item.time} wrap="nowrap" align="flex-start" className={classes.row}>
            <Text size="sm" fw={600} w={54}>
              {item.time}
            </Text>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {item.customer}
              </Text>
              <Text size="xs" c="dimmed">
                {item.repairType} · {item.technician}
              </Text>
            </div>
            <Badge color={STATUS_COLORS[item.status]} variant="light" size="sm" radius="sm">
              {item.status}
            </Badge>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
