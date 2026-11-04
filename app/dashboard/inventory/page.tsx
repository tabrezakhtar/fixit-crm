import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { InventoryPage } from '../../../components/Dashboard/InventoryPage';
import { getInventoryItems } from '../../../lib/inventory';

export default async function Inventory() {
  const items = await getInventoryItems();

  return (
    <DashboardShell>
      <InventoryPage items={items} />
    </DashboardShell>
  );
}