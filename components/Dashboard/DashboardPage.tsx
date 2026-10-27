'use client';

import { useEffect, useState } from 'react';
import { Alert, Grid, GridCol, SimpleGrid, Stack } from '@mantine/core';
import type { getDashboardData } from '../../lib/dashboard';
import { AttentionRequired } from './AttentionRequired';
import { DashboardWelcome } from './DashboardWelcome';
import { dashboardStatusCards } from './data';
import { RecentRepairJobsTable } from './RecentRepairJobsTable';
import { RepairJobsChart } from './RepairJobsChart';
import { StatCard } from './StatCard';
import { TodaySchedule } from './TodaySchedule';

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export function DashboardPage({ username }: { username: string }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch('/api/dashboard', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load dashboard data.');
        }
        setDashboardData((await response.json()) as DashboardData);
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load dashboard data. Refresh to try again.');
        }
      }
    }

    void loadDashboard();
    return () => controller.abort();
  }, []);

  const loading = dashboardData === null && error === null;

  return (
    <Stack gap="lg">
      <DashboardWelcome username={username} />

      {error && (
        <Alert color="red" title="Dashboard unavailable">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 6 }}>
        {dashboardData
          ? dashboardData.summaryCards.map((card) => (
              <StatCard key={card.label} {...card} loading={false} />
            ))
          : loading
            ? dashboardStatusCards.map(({ label, color, icon }) => (
                <StatCard
                  key={label}
                  label={label}
                  color={color}
                  icon={icon}
                  value=""
                  delta=""
                  trend="flat"
                  loading
                />
              ))
            : null}
      </SimpleGrid>

      <Grid>
        <GridCol span={{ base: 12, lg: 8 }}>
          <RepairJobsChart data={dashboardData?.chart ?? []} loading={loading} />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <AttentionRequired items={dashboardData?.attentionItems ?? []} loading={loading} />
        </GridCol>
      </Grid>

      <Grid>
        <GridCol span={{ base: 12, lg: 8 }}>
          <RecentRepairJobsTable jobs={dashboardData?.recentRepairJobs ?? []} loading={loading} />
        </GridCol>
        <GridCol span={{ base: 12, lg: 4 }}>
          <TodaySchedule items={dashboardData?.todaySchedule ?? []} loading={loading} />
        </GridCol>
      </Grid>
    </Stack>
  );
}
