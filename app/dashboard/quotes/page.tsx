import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { QuotesPage } from '../../../components/Dashboard/QuotesPage';
import { getQuotes } from '../../../lib/quotes';

export default async function Quotes() {
  const quotes = await getQuotes();

  return (
    <DashboardShell>
      <QuotesPage quotes={quotes} />
    </DashboardShell>
  );
}