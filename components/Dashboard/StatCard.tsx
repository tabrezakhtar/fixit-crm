import { Card, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconBox,
  IconCircleCheck,
  IconCurrencyPound,
  IconFileInvoice,
  IconStethoscope,
  IconTool,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react';
import type { SummaryCardData } from './data';
import classes from './StatCard.module.css';

const ICONS: Record<string, typeof IconTool> = {
  tool: IconTool,
  stethoscope: IconStethoscope,
  box: IconBox,
  check: IconCircleCheck,
  alert: IconAlertTriangle,
  currency: IconCurrencyPound,
  approval: IconFileInvoice,
};

export function StatCard({ label, value, delta, trend, color, icon }: SummaryCardData) {
  const Icon = ICONS[icon];
  const TrendIcon = trend === 'down' ? IconTrendingDown : IconTrendingUp;

  return (
    <Card withBorder radius="md" padding="lg" className={classes.card}>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
          <Text fz={28} fw={700} mt={4}>
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={42} radius="md">
          <Icon size={22} stroke={1.6} />
        </ThemeIcon>
      </Group>
      <Group gap={6} mt="sm">
        {trend !== 'flat' && (
          <TrendIcon size={16} stroke={1.8} color={`var(--mantine-color-${color}-6)`} />
        )}
        <Text size="xs" c="dimmed">
          {delta}
        </Text>
      </Group>
    </Card>
  );
}
