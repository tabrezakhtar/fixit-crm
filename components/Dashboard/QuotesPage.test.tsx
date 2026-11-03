import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../test-utils';
import { QuotesPage } from './QuotesPage';

const quotes = [
  {
    reference: 'QT-3101',
    customer: 'Grace Lin',
    customerEmail: 'grace@example.com',
    repairReference: 'RJ-2045',
    equipment: 'MacBook Air M2',
    status: 'Sent' as const,
    totalPence: 19400,
    issuedAt: '12 Oct 2026',
    validUntil: '26 Oct 2026',
  },
];

describe('QuotesPage', () => {
  it('opens the selected quote in a modal PDF viewer', () => {
    render(<QuotesPage quotes={quotes} />);

    fireEvent.click(screen.getByRole('button', { name: 'View QT-3101 PDF' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Generating PDF...')).toBeInTheDocument();
    const pdfFrame = screen.getByTitle('Quote QT-3101 PDF');
    expect(pdfFrame).toHaveAttribute(
      'src',
      '/api/quotes/QT-3101/pdf'
    );

    fireEvent.load(pdfFrame);

    expect(screen.queryByText('Generating PDF...')).not.toBeInTheDocument();
  });
});