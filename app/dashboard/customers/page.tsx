import { CustomersPage } from '../../../components/Dashboard/CustomersPage';
import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { getCustomers } from '../../../lib/customers';

export default async function Customers() {
  const rows = await getCustomers();
  const customers = rows.map((customer) => ({ ...customer, id: customer.id.toString() }));

  return (
    <DashboardShell>
      <CustomersPage customers={customers} />
    </DashboardShell>
  );
}
