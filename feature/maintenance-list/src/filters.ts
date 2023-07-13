import { MaintenanceListResponse } from '@immotech-feature/maintenance-api';

export function applyFilters(
  data: MaintenanceListResponse[],
  filters: {
    type?: string;
    name?: string;
    parentName?: string;
  },
): MaintenanceListResponse[] {
  const filterMethods = [
    (item: MaintenanceListResponse) =>
      filters.type ? filters.type == item.type.split('(')[1].replace(')', '') : item,

    (item: MaintenanceListResponse) =>
      filters.name ? item.title?.includes(filters.name) || item.name?.includes(filters.name) : item,

    (item: MaintenanceListResponse) =>
      filters.parentName ? item.assigned_entity_title?.includes(filters.parentName) : item,
  ];

  return data.reduce((accumulator: MaintenanceListResponse[], currentItem) => {
    for (let i = 0; i < filterMethods.length; i++) {
      if (!filterMethods[i](currentItem)) {
        return accumulator;
      }
    }
    return [...accumulator, currentItem];
  }, []);
}
