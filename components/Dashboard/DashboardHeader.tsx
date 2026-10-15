'use client';

import {
  Box,
  ActionIcon,
  Avatar,
  Breadcrumbs,
  Button,
  Group,
  Indicator,
  Text,
  TextInput,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IconBell, IconChevronRight, IconMoon, IconPlus, IconSearch, IconSun } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { primaryNavItems } from './data';
import classes from './DashboardHeader.module.css';

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: false });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      <Box darkHidden><IconMoon size={20} stroke={1.6} /></Box>
      <Box lightHidden><IconSun size={20} stroke={1.6} /></Box>
    </ActionIcon>
  );
}

export function DashboardHeader({ burger }: { burger?: ReactNode }) {
  const pathname = usePathname();
  const pageLabel = primaryNavItems.find((item) => item.href === pathname)?.label ?? 'Dashboard';

  return (
    <Group h="100%" px="md" justify="space-between" wrap="nowrap">
      <Group gap="md" wrap="nowrap">
        {burger}
        <div>
          <Image
            src="/fixitcrm-logo-header.png"
            alt="FixitCRM logo"
            width={2078}
            height={757}
            className={classes.logo}
            priority
          />
          <Breadcrumbs separator={<IconChevronRight size={12} />} className={classes.breadcrumbs}>
            <Text size="xs" c="dimmed">
              Home
            </Text>
            <Text size="xs" c="dimmed">
              {pageLabel}
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
        <ThemeToggle />
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
