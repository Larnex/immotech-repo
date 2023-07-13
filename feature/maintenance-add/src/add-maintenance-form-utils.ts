import { MaintenanceListResponse } from '@immotech-feature/maintenance-api';
// import { Entity, PropertyType, UnitResponse } from './your-types-file';
import { Entity } from '@immotech-feature/entity-api';
import { UnitResponse } from '@immotech-feature/unit-api';

interface PropertyType {
  title: string;
  nid: string;
  id?: string;
}

export const createInitiateStateForRadioButtons = () => [
  {
    id: '1',
    label: 'TGA',
    value: 'mep',
    selected: true,
  },
  {
    id: '2',
    label: 'Wartung',
    value: 'maintenance',
    selected: false,
  },
];

export const createEntityPick = (allEntities: Entity[] | undefined) =>
  (allEntities ?? []).map(({ nid, title, id }: Entity) => ({
    label: title,
    value: nid ?? id,
  }));

export const createPropertyPick = (allProperties: PropertyType[] | undefined) =>
  (allProperties ?? [])?.map(({ title, nid, id }: PropertyType) => ({
    label: title,
    value: nid ?? id,
  }));

export const createUnitResponsePick = (allUnits: UnitResponse[] | undefined) =>
  (allUnits ?? [])?.map(({ title, nid, id }: UnitResponse) => ({
    label: title,
    value: nid ?? id,
  }));

export const createMaintenancePick = (allMaintenances: MaintenanceListResponse[] | undefined) =>
  (allMaintenances ?? [])?.map(({ title, nid, name }: MaintenanceListResponse) => ({
    label: name! ?? title!,
    value: nid! ?? name!,
  }));

export const createTypePick = (types: any) =>
  Object.entries(types ?? {}).map((value: any) => {
    return {
      label: value[1],
      value: value[0],
    };
  });
