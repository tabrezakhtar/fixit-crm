import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { RepairJobListItem } from './data';
import { RepairJobsPage } from './RepairJobsPage';

const jobs: RepairJobListItem[] = [
  {
    reference: 'JOB-3001',
    customer: 'Alex Smith',
    customerEmail: 'alex@example.com',
    equipment: 'ThinkPad X1',
    issue: 'Damaged screen',
    status: 'Awaiting Parts',
    technician: 'Jordan Lee',
    dateReceived: '20 Oct 2026',
  },
  {
    reference: 'JOB-3002',
    customer: 'Sam Jones',
    customerEmail: 'sam@example.com',
    equipment: 'Pixel 9',
    issue: 'Battery replacement',
    status: 'In Progress',
    technician: 'Taylor Reed',
    dateReceived: '21 Oct 2026',
  },
];

describe('RepairJobsPage', () => {
  it('filters jobs by search text', async () => {
    const user = userEvent.setup();
    render(<RepairJobsPage jobs={jobs} />);

    await user.type(screen.getByRole('textbox', { name: 'Search repair jobs' }), 'pixel');

    expect(screen.getByText('JOB-3002')).toBeInTheDocument();
    expect(screen.queryByText('JOB-3001')).not.toBeInTheDocument();
  });

  it('shows an empty state when no jobs match the search', async () => {
    const user = userEvent.setup();
    render(<RepairJobsPage jobs={jobs} />);

    await user.type(screen.getByRole('textbox', { name: 'Search repair jobs' }), 'unknown');

    expect(screen.getByText('No repair jobs match your filters.')).toBeInTheDocument();
  });
});
