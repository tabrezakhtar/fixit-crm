import userEvent from '@testing-library/user-event';
import { render, screen } from '../../test-utils';
import type { EquipmentModel } from './data';
import { EquipmentPage } from './EquipmentPage';

const models: EquipmentModel[] = [
  {
    name: 'ThinkPad X1',
    category: 'Laptop',
    repairCount: 2,
    latestRepair: {
      reference: 'JOB-2001',
      customer: 'Alex Smith',
      issue: 'Damaged screen',
      status: 'Awaiting Parts',
      dateReceived: '20 Oct 2026',
    },
  },
  {
    name: 'Pixel 9',
    category: 'Phone',
    repairCount: 1,
    latestRepair: {
      reference: 'JOB-2002',
      customer: 'Sam Jones',
      issue: 'Battery replacement',
      status: 'In Progress',
      dateReceived: '21 Oct 2026',
    },
  },
];

describe('EquipmentPage', () => {
  it('filters models by search text', async () => {
    const user = userEvent.setup();
    render(<EquipmentPage models={models} />);

    await user.type(screen.getByRole('textbox', { name: 'Search equipment' }), 'pixel');

    expect(screen.getByText('Pixel 9')).toBeInTheDocument();
    expect(screen.queryByText('ThinkPad X1')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no matching models', async () => {
    const user = userEvent.setup();
    render(<EquipmentPage models={models} />);

    await user.type(screen.getByRole('textbox', { name: 'Search equipment' }), 'unknown');

    expect(screen.getByText('No equipment matches your filters.')).toBeInTheDocument();
  });
});
