import { DashboardShell } from '../../../components/Dashboard/DashboardShell';
import { EquipmentPage } from '../../../components/Dashboard/EquipmentPage';
import { getEquipmentModels } from '../../../lib/equipment';

export default async function Equipment() {
  const models = await getEquipmentModels();

  return (
    <DashboardShell>
      <EquipmentPage models={models} />
    </DashboardShell>
  );
}
