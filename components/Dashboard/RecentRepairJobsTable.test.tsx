import { render, screen } from '../../test-utils';
import type { RepairJob } from './data';
import { RecentRepairJobsTable } from './RecentRepairJobsTable';

const job: RepairJob = {
  reference: 'JOB-4001',
  customer: 'Alex Smith',
  equipment: 'ThinkPad X1',
  issue: 'Damaged screen',
  status: 'Awaiting Parts',
  technician: 'Jordan Lee',
  dateReceived: '20 Oct 2026',
};

describe('RecentRepairJobsTable', () => {
  it('shows a loading indicator while jobs load', () => {
    render(<RecentRepairJobsTable jobs={[]} loading />);

    expect(screen.getByLabelText('Loading repair jobs')).toBeInTheDocument();
  });

  it('shows the empty state when there are no jobs', () => {
    render(<RecentRepairJobsTable jobs={[]} loading={false} />);

    expect(screen.getByText('No repair jobs found.')).toBeInTheDocument();
  });

  it('shows a repair job when loaded', () => {
    render(<RecentRepairJobsTable jobs={[job]} loading={false} />);

    expect(screen.getByText('JOB-4001')).toBeInTheDocument();
    expect(screen.getByText('Alex Smith')).toBeInTheDocument();
    expect(screen.getByText('Damaged screen')).toBeInTheDocument();
  });
});
