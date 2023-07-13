export interface ById<T> {
  [id: string]: T;
}

export interface PickerItem {
  label: string;
  value: string | number | boolean;
}
