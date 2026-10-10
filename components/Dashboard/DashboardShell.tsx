'use client';

import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import classes from './DashboardShell.module.css';

export function DashboardShell({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShellHeader>
        <DashboardHeader
          burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />}
        />
      </AppShellHeader>
      <AppShellNavbar className={classes.navbar}>
        <DashboardSidebar />
      </AppShellNavbar>
      <AppShellMain className={classes.main}>{children}</AppShellMain>
    </AppShell>
  );
}
