'use client';

import { useState } from 'react';
import { IconChartBar } from '@tabler/icons-react';
import { Badge, Card, Group, Select, Stack, Table, Text } from '@mantine/core';
import type { ReportData, ReportId } from './data';
import { reportOptions } from './data';
import classes from './DataTable.module.css';

export function ReportsPage({ reports }: { reports: ReportData[] }) {
  const [selectedReportId, setSelectedReportId] = useState<ReportId>(
    reports[0]?.id ?? 'repair-status'
  );
  const selectedReport = reports.find((report) => report.id === selectedReportId);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700}>
            Reports
          </Text>
          <Text size="sm" c="dimmed">
            Operational snapshots across repairs, billing, inventory, and staffing
          </Text>
        </div>
        <Select
          aria-label="Select report"
          data={reportOptions}
          value={selectedReportId}
          onChange={(value) => {
            if (value) setSelectedReportId(value as ReportId);
          }}
          leftSection={<IconChartBar size={16} />}
          w={{ base: '100%', sm: 280 }}
          allowDeselect={false}
        />
      </Group>

      {selectedReport && (
        <Card withBorder radius="md" padding="lg">
          <Group justify="space-between" mb="md">
            <div>
              <Text fw={600}>{selectedReport.label}</Text>
              <Text size="xs" c="dimmed">
                {selectedReport.description}
              </Text>
            </div>
            <Badge variant="light" color="blue">
              {selectedReport.rows.length} records
            </Badge>
          </Group>

          <div className={classes.scrollContainer}>
            <Table
              className={classes.repairTable}
              horizontalSpacing="md"
              verticalSpacing="sm"
              highlightOnHover
            >
              <thead>
                <tr>
                  <th className={classes.headerCell}>{selectedReport.subjectHeading}</th>
                  <th className={classes.headerCell}>{selectedReport.detailHeading}</th>
                  <th className={classes.headerCell}>{selectedReport.metricHeading}</th>
                  <th className={classes.headerCell}>{selectedReport.statusHeading}</th>
                </tr>
              </thead>
              <tbody>
                {selectedReport.rows.length > 0 ? (
                  selectedReport.rows.map((row) => (
                    <tr key={row.id}>
                      <td className={classes.cell}>
                        <Text size="sm" fw={600}>
                          {row.subject}
                        </Text>
                      </td>
                      <td className={classes.cell}>{row.detail || '—'}</td>
                      <td className={classes.cell}>
                        <Text size="sm" fw={600}>
                          {row.metric}
                        </Text>
                      </td>
                      <td className={classes.cell}>
                        {row.status ? <Badge variant="light">{row.status}</Badge> : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <Text ta="center" c="dimmed" py="lg">
                        No records for this report.
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Stack>
  );
}