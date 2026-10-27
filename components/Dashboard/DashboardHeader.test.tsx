import { render, screen } from '../../test-utils';
import { DashboardHeader } from './DashboardHeader';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/appointments',
}));

describe('DashboardHeader', () => {
  it('shows the current page in the breadcrumb', () => {
    render(<DashboardHeader />);

    expect(screen.getByText('Appointments & Schedule')).toBeInTheDocument();
  });

  it('links the logo to the default dashboard page', () => {
    render(<DashboardHeader />);

    const logo = screen.getByRole('img', { name: 'FixitCRM logo' });

    expect(logo.closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
