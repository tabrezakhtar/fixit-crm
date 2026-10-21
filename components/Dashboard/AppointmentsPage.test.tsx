import type { ScheduleEventData } from '@mantine/schedule';
import { render, screen } from '../../test-utils';
import { AppointmentsPage } from './AppointmentsPage';

function createEvent(id = 'appointment-1'): ScheduleEventData {
  return {
    id,
    title: 'Alex Smith · Screen repair',
    start: '2026-10-21 09:00:00',
    end: '2026-10-21 10:00:00',
    color: 'blue',
  };
}

describe('AppointmentsPage', () => {
  it('shows the appointment count for the given events', () => {
    render(<AppointmentsPage events={[createEvent(), createEvent('appointment-2')]} />);

    expect(screen.getByText('2 appointments')).toBeInTheDocument();
  });

  it('shows zero appointments when there are none', () => {
    render(<AppointmentsPage events={[]} />);

    expect(screen.getByText('0 appointments')).toBeInTheDocument();
  });
});
