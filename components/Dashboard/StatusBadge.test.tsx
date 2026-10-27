import { render, screen } from '../../test-utils';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('displays the repair job status', () => {
    render(<StatusBadge status="Awaiting Parts" />);

    expect(screen.getByText('Awaiting Parts')).toBeInTheDocument();
  });
});
