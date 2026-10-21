import { render, screen } from '../../test-utils';
import { DashboardSidebar } from './DashboardSidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/customers',
}));
jest.mock('../../app/actions/auth', () => ({ logout: jest.fn() }));

describe('DashboardSidebar', () => {
  it('renders dashboard navigation links', () => {
    render(<DashboardSidebar />);

    expect(screen.getByRole('link', { name: 'Customers' })).toHaveAttribute(
      'href',
      '/dashboard/customers',
    );
    expect(screen.getByRole('link', { name: 'Repair Jobs' })).toHaveAttribute(
      'href',
      '/dashboard/repair-jobs',
    );
  });
});