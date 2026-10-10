import { Card, Group, Select, Text } from '@mantine/core';
import { weeklyJobsChart } from './data';
import classes from './RepairJobsChart.module.css';

const MAX_VALUE = Math.max(...weeklyJobsChart.flatMap((d) => [d.created, d.completed]));

export function RepairJobsChart() {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={600}>Repair Jobs Overview</Text>
          <Text size="xs" c="dimmed">
            Jobs created vs completed, last 7 days
          </Text>
        </div>
        <Select
          data={['Last 7 days', 'Last 30 days', 'This quarter']}
          defaultValue="Last 7 days"
          size="xs"
          w={140}
          radius="md"
        />
      </Group>

      <Group gap="lg" mb="md">
        <Group gap={6}>
          <span className={classes.legendDotCreated} />
          <Text size="xs" c="dimmed">
            Created
          </Text>
        </Group>
        <Group gap={6}>
          <span className={classes.legendDotCompleted} />
          <Text size="xs" c="dimmed">
            Completed
          </Text>
        </Group>
      </Group>

      <Group align="flex-end" gap="md" className={classes.chart}>
        {weeklyJobsChart.map((d) => (
          <div key={d.day} className={classes.column}>
            <Group align="flex-end" gap={4} className={classes.bars}>
              <div
                className={classes.barCreated}
                style={{ height: `${(d.created / MAX_VALUE) * 100}%` }}
                title={`Created: ${d.created}`}
              />
              <div
                className={classes.barCompleted}
                style={{ height: `${(d.completed / MAX_VALUE) * 100}%` }}
                title={`Completed: ${d.completed}`}
              />
            </Group>
            <Text size="xs" c="dimmed" mt={6}>
              {d.day}
            </Text>
          </div>
        ))}
      </Group>
    </Card>
  );
}
