import { render, screen } from '../../test-utils';
import type { SummaryCardData } from './data';
import { StatCard } from './StatCard';

const card: SummaryCardData = {
  label: 'Jobs In Progress',
  value: '12',
  delta: 'Current jobs',
  trend: 'flat',
  color: 'blue',
  icon: 'tool',
};

describe('StatCard', () => {
  it('shows the value when loaded', () => {
    render(<StatCard {...card} loading={false} />);

    expect(screen.getByText('Jobs In Progress')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows a loading indicator instead of the value while loading', () => {
    render(<StatCard {...card} loading />);

    expect(screen.getByLabelText('Loading Jobs In Progress')).toBeInTheDocument();
    expect(screen.queryByText('12')).not.toBeInTheDocument();
  });
});
