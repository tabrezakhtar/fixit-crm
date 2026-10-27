import { render, screen } from '../../test-utils';
import { AttentionRequired } from './AttentionRequired';
import type { AttentionItem } from './data';

const item: AttentionItem = {
  reference: 'JOB-1042',
  customer: 'Alex Smith',
  description: 'Laptop will not power on',
  status: 'Overdue',
  due: 'Received 20 Oct 2026',
};

describe('AttentionRequired', () => {
  it('shows a loading indicator while loading', () => {
    render(<AttentionRequired items={[]} loading />);

    expect(screen.getByLabelText('Loading jobs requiring attention')).toBeInTheDocument();
  });

  it('shows an empty message when there are no attention items', () => {
    render(<AttentionRequired items={[]} loading={false} />);

    expect(screen.getByText('No jobs currently need attention.')).toBeInTheDocument();
  });

  it('shows the attention item details', () => {
    render(<AttentionRequired items={[item]} loading={false} />);

    expect(screen.getByText('JOB-1042 · Alex Smith')).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.getByText(item.due)).toBeInTheDocument();
  });
});
