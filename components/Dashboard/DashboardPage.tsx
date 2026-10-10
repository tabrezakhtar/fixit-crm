import { Grid, GridCol, SimpleGrid, Stack } from '@mantine/core';
import { AttentionRequired } from './AttentionRequired';
import { DashboardWelcome } from './DashboardWelcome';
import { RecentRepairJobsTable } from './RecentRepairJobsTable';
import { RepairJobsChart } from './RepairJobsChart';
import { StatCard } from './StatCard';
import { summaryCards } from './data';
import { TodaySchedule } from './TodaySchedule';

export function DashboardPage() {
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
          <RepairJobsChart />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <AttentionRequired />
        </GridCol>
      </Grid>

      <Grid>
        <GridCol span={{ base: 12, lg: 8 }}>
          <RecentRepairJobsTable />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <TodaySchedule />
        </GridCol>
      </Grid>
    </Stack>
  );
}
