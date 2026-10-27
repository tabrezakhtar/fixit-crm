'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import { Button, NavLink, Popover, Stack } from '@mantine/core';
import { logout } from '../../app/actions/auth';
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
          <Popover key={item.label} position="top" withArrow shadow="md">
            <Popover.Target>
              <NavLink
                label={item.label}
                leftSection={<item.icon size={18} stroke={1.8} />}
                className={classes.navLink}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <form action={logout}>
                <Button type="submit" color="red" leftSection={<IconLogout size={16} />}>
                  Log out
                </Button>
              </form>
            </Popover.Dropdown>
          </Popover>
        ))}
      </Stack>
    </Stack>
  );
}
