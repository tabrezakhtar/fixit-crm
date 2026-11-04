import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { TechnicianListItem } from './data';
import { TechniciansPage } from './TechniciansPage';

const technicians: TechnicianListItem[] = [
  {
    id: '1',
    name: 'James Carter',
    isActive: true,
    repairJobs: 5,
    openJobs: 4,
    overdueJobs: 1,
    appointments: 2,
  },
  {
    id: '2',
    name: 'Oliver Grant',
    isActive: false,
    repairJobs: 0,
    openJobs: 0,
    overdueJobs: 0,
    appointments: 0,
  },
];

describe('TechniciansPage', () => {
  it('filters roster by active availability', async () => {
    const user = userEvent.setup();
    render(<TechniciansPage technicians={technicians} />);

    await user.click(screen.getByRole('radio', { name: 'Active' }));

    expect(screen.getByText('James Carter')).toBeInTheDocument();
    expect(screen.queryByText('Oliver Grant')).not.toBeInTheDocument();
  });

  it('shows the no-technicians state', () => {
    render(<TechniciansPage technicians={[]} />);

    expect(screen.getByText('No technicians found.')).toBeInTheDocument();
  });
});