import {
  AdjustmentInput,
  NewWarehouseItem,
  UpdateWarehouseItemInput,
  applyStockAdjustment,
  findWarehouseItemById,
  findWarehouseItemBySku,
  findWarehouseItems,
  insertWarehouseItem,
  listAdjustmentsForItem,
  setWarehouseItemStatus,
  updateWarehouseItem,
} from './warehouse.repository';
import {
  WarehouseStockFilters,
  WarehouseStockItem,
  WarehouseStockAdjustment,
} from './warehouse.types';

export function mapStockItem(item: WarehouseStockItem) {
  const minQuantity = item.minQuantity ?? null;
  const maxQuantity = item.maxQuantity ?? null;
  const reorderPoint = item.reorderPoint ?? null;
  const quantity = item.quantityOnHand;

  return {
    ...item,
    availableQuantity: quantity,
    isBelowMinimum:
      typeof minQuantity === 'number' ? quantity < minQuantity : false,
    isAboveMaximum:
      typeof maxQuantity === 'number' ? quantity > maxQuantity : false,
    needsReorder:
      typeof reorderPoint === 'number' ? quantity <= reorderPoint : false,
  };
}

export async function listWarehouseItems(filters: WarehouseStockFilters = {}) {
  const items = await findWarehouseItems(filters);
  return items.map(mapStockItem);
}

export async function getWarehouseItem(id: string) {
  const item = await findWarehouseItemById(id);
  return item ? mapStockItem(item) : null;
}

export async function createWarehouseItem(data: NewWarehouseItem) {
  const existing = await findWarehouseItemBySku(data.sku);
  if (existing) {
    const error = new Error('SKU_ALREADY_EXISTS');
    throw error;
  }
  const item = await insertWarehouseItem(data);
  return mapStockItem(item);
}

export async function updateWarehouseItemDetails(
  id: string,
  updates: UpdateWarehouseItemInput
) {
  const item = await updateWarehouseItem(id, updates);
  return item ? mapStockItem(item) : null;
}

export async function archiveWarehouseItem(id: string) {
  const item = await setWarehouseItemStatus(id, 'inactive');
  return item ? mapStockItem(item) : null;
}

export async function reactivateWarehouseItem(id: string) {
  const item = await setWarehouseItemStatus(id, 'active');
  return item ? mapStockItem(item) : null;
}

export async function adjustWarehouseItemStock(
  id: string,
  adjustment: AdjustmentInput
): Promise<{
  item: ReturnType<typeof mapStockItem>;
  adjustment: WarehouseStockAdjustment;
}> {
  const { item, adjustment: createdAdjustment } = await applyStockAdjustment(
    id,
    adjustment
  );

  return {
    item: mapStockItem(item),
    adjustment: createdAdjustment,
  };
}

export async function listWarehouseAdjustments(id: string, limit = 50) {
  return listAdjustmentsForItem(id, limit);
}
