'use client';

import { Card, Center, Group, Loader, Select, Text } from '@mantine/core';
import type { ChartDay } from './data';
import classes from './RepairJobsChart.module.css';

export function RepairJobsChart({ data, loading }: { data: ChartDay[]; loading: boolean }) {
  const maxValue = Math.max(1, ...data.flatMap((day) => [day.created, day.readyForCollection]));

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={600}>Repair Jobs Overview</Text>
          <Text size="xs" c="dimmed">
            Jobs received and ready for collection, last 7 days
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
            Ready for collection
          </Text>
        </Group>
      </Group>

      {loading ? (
        <Center h={180}><Loader size="sm" aria-label="Loading repair job chart" /></Center>
      ) : (
        <Group align="flex-end" gap="md" className={classes.chart}>
          {data.map((d) => (
          <div key={d.day} className={classes.column}>
            <Group align="flex-end" gap={4} className={classes.bars}>
              <div
                className={classes.barCreated}
                style={{ height: `${(d.created / maxValue) * 100}%` }}
                title={`Created: ${d.created}`}
              />
              <div
                className={classes.barCompleted}
                style={{ height: `${(d.readyForCollection / maxValue) * 100}%` }}
                title={`Ready for collection: ${d.readyForCollection}`}
              />
            </Group>
            <Text size="xs" c="dimmed" mt={6}>
              {d.day}
            </Text>
          </div>
          ))}
        </Group>
      )}
    </Card>
  );
}
