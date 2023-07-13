export interface Props {
  entityId?: string;
  internalNumber?: string;
  internalID?: string;
  nid?: string;
  name?: string;
  zipCode?: string;
  city?: string;
  filterHeaderActive?: boolean;
  onPropertySelect?: (
    id: string,
    internalID: string,
    object?: string,
    lat?: string,
    lon?: string,
    title?: string,
  ) => void;
  onAddPropertyTap?: () => void;
  onEditPropertyTap?: (id: string) => void;
  onSearchIconTap?: () => void;
  onClearSearchTap?: () => void;
  onSortIconTap?: () => void;
  byName?: boolean;
  byNumber?: boolean;
  byZip?: boolean;
  byCity?: boolean;
}
