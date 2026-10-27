import { render, screen } from '../../test-utils';
import type { ScheduleItem } from './data';
import { TodaySchedule } from './TodaySchedule';

const item: ScheduleItem = {
  time: '09:00',
  customer: 'Alex Smith',
  repairType: 'Laptop drop-off',
  technician: 'Jordan Lee',
  status: 'Drop-off',
};

describe('TodaySchedule', () => {
  it('shows a loading indicator while schedule loads', () => {
    render(<TodaySchedule items={[]} loading />);

    expect(screen.getByLabelText("Loading today's schedule")).toBeInTheDocument();
  });

  it('shows an empty state when there are no appointments', () => {
    render(<TodaySchedule items={[]} loading={false} />);

    expect(screen.getByText('No appointments scheduled today.')).toBeInTheDocument();
  });

  it('shows appointment details when loaded', () => {
    render(<TodaySchedule items={[item]} loading={false} />);

    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('Alex Smith')).toBeInTheDocument();
    expect(screen.getByText('Laptop drop-off · Jordan Lee')).toBeInTheDocument();
  });
});
