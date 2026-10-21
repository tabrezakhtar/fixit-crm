import { render, screen } from '../../test-utils';
import { DashboardWelcome } from './DashboardWelcome';

describe('DashboardWelcome', () => {
  it('greets the user and shows the primary dashboard actions', async () => {
    render(<DashboardWelcome username="Alex" />);

    expect(await screen.findByRole('heading', { name: /Alex/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Customer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schedule Appointment' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Repair Job' })).toBeInTheDocument();
  });
});