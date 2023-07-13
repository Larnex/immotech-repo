import { PropertyListResponse } from '@immotech-feature/property-api';

export function applyFilters(
  data: PropertyListResponse[],
  filters: {
    internalNumber?: string;
    name?: string;
    nid?: string;
    zipCode?: string;
    city?: string;
  },
): PropertyListResponse[] {
  const filterMethods = [
    (item: PropertyListResponse) =>
      filters.internalNumber ? item.id?.includes(filters.internalNumber) : item,
    (item: PropertyListResponse) => (filters.name ? item.title?.includes(filters.name) : item),
    (item: PropertyListResponse) => (filters.nid ? item.nid == filters.nid : item),
    (item: PropertyListResponse) =>
      filters.zipCode ? item.zip_code?.includes(filters.zipCode) : item,
    (item: PropertyListResponse) => (filters.city ? item.city?.includes(filters.city) : item),
  ];

  return data.reduce((accumulator: PropertyListResponse[], currentItem) => {
    for (let i = 0; i < filterMethods.length; i++) {
      if (!filterMethods[i](currentItem)) {
        return accumulator;
      }
    }
    return [...accumulator, currentItem];
  }, []);
}
