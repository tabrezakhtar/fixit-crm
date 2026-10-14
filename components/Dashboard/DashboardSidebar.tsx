'use client';

import { Box, Group, NavLink, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconTool } from '@tabler/icons-react';
import { primaryNavItems, secondaryNavItems } from './data';
import classes from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Stack h="100%" justify="space-between" py="md" px="xs">
      <div>
        <Stack gap={2}>
          {primaryNavItems.map((item) => {
            const props = {
              label: item.label,
              leftSection: <item.icon size={18} stroke={1.8} />,
              active: item.href === pathname,
              className: classes.navLink,
              variant: 'filled' as const,
            };

            return item.href ? (
              <NavLink key={item.label} {...props} component={Link} href={item.href} />
            ) : (
              <NavLink key={item.label} {...props} />
            );
          })}
        </Stack>
      </div>
      <Stack gap={2}>
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            leftSection={<item.icon size={18} stroke={1.8} />}
            className={classes.navLink}
          />
        ))}
      </Stack>
    </Stack>
  );
}
