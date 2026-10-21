import { render, screen } from '../../test-utils';
import type { ChartDay } from './data';
import { RepairJobsChart } from './RepairJobsChart';

describe('RepairJobsChart', () => {
  it('shows a loading indicator while chart data loads', () => {
    render(<RepairJobsChart data={[]} loading />);

    expect(screen.getByLabelText('Loading repair job chart')).toBeInTheDocument();
  });

  it('shows chart days and counts when loaded', () => {
    const data: ChartDay[] = [{ day: 'Tue', created: 3, readyForCollection: 1 }];
    render(<RepairJobsChart data={data} loading={false} />);

    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByTitle('Created: 3')).toBeInTheDocument();
    expect(screen.getByTitle('Ready for collection: 1')).toBeInTheDocument();
  });
});