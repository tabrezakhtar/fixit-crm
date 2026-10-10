import { Box, Group, NavLink, Stack, Text } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';
import { primaryNavItems, secondaryNavItems } from './data';
import classes from './DashboardSidebar.module.css';

export function DashboardSidebar() {
  return (
    <Stack h="100%" justify="space-between" py="md" px="xs">
      <div>
        <Group gap={8} px="sm" mb="lg">
          <Box className={classes.logo}>
            <IconTool size={18} stroke={1.8} />
          </Box>
          <Text fw={700} c="white" size="md">
            FixIt CRM
          </Text>
        </Group>
        <Stack gap={2}>
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.8} />}
              active={item.active}
              className={classes.navLink}
              variant="filled"
            />
          ))}
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
