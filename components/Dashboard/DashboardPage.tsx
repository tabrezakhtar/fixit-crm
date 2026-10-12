import { Grid, GridCol, SimpleGrid, Stack } from '@mantine/core';
import { AttentionRequired } from './AttentionRequired';
import { DashboardWelcome } from './DashboardWelcome';
import { RecentRepairJobsTable } from './RecentRepairJobsTable';
import { RepairJobsChart } from './RepairJobsChart';
import { StatCard } from './StatCard';
import { TodaySchedule } from './TodaySchedule';
import type { getDashboardData } from '../../lib/dashboard';

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export function DashboardPage({
  summaryCards,
  chart,
  attentionItems,
  recentRepairJobs,
  todaySchedule,
}: DashboardData) {
  return (
    <Stack gap="lg">
      <DashboardWelcome />

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 6 }}>
        {summaryCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </SimpleGrid>

      <Grid>
        <GridCol span={{ base: 12, lg: 8 }}>
          <RepairJobsChart data={chart} />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <AttentionRequired items={attentionItems} />
        </GridCol>
      </Grid>

      <Grid>
        <GridCol span={{ base: 12, lg: 8 }}>
          <RecentRepairJobsTable jobs={recentRepairJobs} />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <TodaySchedule items={todaySchedule} />
        </GridCol>
      </Grid>
    </Stack>
  );
}
