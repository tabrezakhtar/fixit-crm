'use client';

import { useState } from 'react';
import {
  IconDeviceDesktop,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconSearch,
} from '@tabler/icons-react';
import {
  Badge,
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import type { EquipmentCategory, EquipmentModel } from './data';
import { StatusBadge } from './StatusBadge';
import classes from './EquipmentPage.module.css';

const categoryFilters = [
  { label: 'All types', value: 'All' },
  { label: 'Laptops', value: 'Laptop' },
  { label: 'Phones', value: 'Phone' },
  { label: 'Other', value: 'Other' },
];

const categoryColors: Record<EquipmentCategory, string> = {
  Laptop: 'blue',
  Phone: 'teal',
  Other: 'orange',
};

const categoryIcons = {
  Laptop: IconDeviceLaptop,
  Phone: IconDeviceMobile,
  Other: IconDeviceDesktop,
};

export function EquipmentPage({ models }: { models: EquipmentModel[] }) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredModels = models.filter((model) => {
    const matchesQuery = [model.name, model.latestRepair.customer, model.latestRepair.issue].some(
      (value) => value.toLowerCase().includes(normalizedQuery)
    );
    return matchesQuery && (categoryFilter === 'All' || model.category === categoryFilter);
  });
  const repairRecordCount = models.reduce((total, model) => total + model.repairCount, 0);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Equipment
          </Text>
          <Text size="sm" c="dimmed">
            Models recorded across repair jobs
          </Text>
        </div>
        <Group gap="xs">
          <Badge variant="light" color="dark">
            {models.length} models
          </Badge>
          <Badge variant="light" color="gray">
            {repairRecordCount} repair records
          </Badge>
        </Group>
      </Group>

      <Group justify="space-between" align="center" wrap="wrap">
        <SegmentedControl
          aria-label="Filter equipment category"
          data={categoryFilters}
          value={categoryFilter}
          onChange={setCategoryFilter}
          size="xs"
        />
        <TextInput
          aria-label="Search equipment"
          placeholder="Search models or customers..."
          leftSection={<IconSearch size={16} />}
          size="xs"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          w={{ base: '100%', sm: 290 }}
        />
      </Group>

      {filteredModels.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }}>
          {filteredModels.map((model) => {
            const DeviceIcon = categoryIcons[model.category];
            return (
              <Card
                key={model.name}
                className={classes.equipmentCard}
                withBorder
                radius="sm"
                padding={0}
                data-category={model.category.toLowerCase()}
              >
                <div className={classes.cardTop}>
                  <Group justify="space-between" align="flex-start">
                    <div className={classes.deviceIcon}>
                      <DeviceIcon size={25} stroke={1.6} />
                    </div>
                    <Badge color={categoryColors[model.category]} variant="light" radius="sm">
                      {model.category}
                    </Badge>
                  </Group>
                  <Text className={classes.modelName} fw={700} size="lg" mt="md" lineClamp={2}>
                    {model.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {model.repairCount}{' '}
                    {model.repairCount === 1 ? 'repair record' : 'repair records'}
                  </Text>
                </div>

                <Stack className={classes.latestRepair} gap="sm">
                  <Group justify="space-between" align="center">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                      Latest repair
                    </Text>
                    <StatusBadge status={model.latestRepair.status} />
                  </Group>
                  <div>
                    <Group justify="space-between" gap="xs">
                      <Text size="sm" fw={600}>
                        {model.latestRepair.reference}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {model.latestRepair.dateReceived}
                      </Text>
                    </Group>
                    <Text size="sm" mt={4}>
                      {model.latestRepair.issue}
                    </Text>
                    <Text size="xs" c="dimmed" mt={3}>
                      {model.latestRepair.customer}
                    </Text>
                  </div>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      ) : (
        <Card withBorder radius="sm" padding="xl">
          <Text ta="center" c="dimmed">
            {models.length === 0
              ? 'No equipment found in repair records.'
              : 'No equipment matches your filters.'}
          </Text>
        </Card>
      )}
    </Stack>
  );
}
