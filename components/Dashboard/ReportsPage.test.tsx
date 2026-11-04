import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { ReportData } from './data';
import { ReportsPage } from './ReportsPage';

const reports: ReportData[] = [
  {
    id: 'repair-status',
    label: 'Repair jobs by status',
    description: 'Current repair workload grouped by job status',
    subjectHeading: 'Status',
    detailHeading: 'Work queue',
    metricHeading: 'Jobs',
    statusHeading: 'Share',
    rows: [
      {
        id: 'In Progress',
        subject: 'In Progress',
        detail: 'Open queue',
        metric: '3',
        status: '50%',
      },
    ],
  },
  {
    id: 'low-stock',
    label: 'Low stock report',
    description: 'Inventory items at or below reorder threshold',
    subjectHeading: 'Part',
    detailHeading: 'SKU · supplier',
    metricHeading: 'On hand / reorder at',
    statusHeading: 'Category',
    rows: [
      {
        id: 'BAT-01',
        subject: 'Phone battery',
        detail: 'BAT-01 · Parts Co',
        metric: '0 / 2',
        status: 'Out of stock',
      },
    ],
  },
];

describe('ReportsPage', () => {
  it('switches selected report and renders its rows', async () => {
    const user = userEvent.setup();
    render(<ReportsPage reports={reports} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: 'Select report' }));
    await user.click(screen.getByRole('option', { name: 'Low stock report' }));

    expect(screen.getByText('Phone battery')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});