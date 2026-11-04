import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { InvoicesPage } from '../../../components/Dashboard/InvoicesPage';
import { getInvoicesAndPayments } from '../../../lib/invoices';

export default async function Invoices() {
  const billingData = await getInvoicesAndPayments();

  return (
    <DashboardShell>
      <InvoicesPage {...billingData} />
    </DashboardShell>
  );
}