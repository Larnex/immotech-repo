import { createContext } from 'react';

export interface ParentIdContextValue {
  entityId?: string | null;
  setEntityId: React.Dispatch<React.SetStateAction<string | null>>;
  propertyId?: string | null;
  setPropertyId: React.Dispatch<React.SetStateAction<string | null>>;
  unitId?: string | null;
  setUnitId: React.Dispatch<React.SetStateAction<string | null>>;
  maintenanceId?: string | null;
  setMaintenanceId: React.Dispatch<React.SetStateAction<string | null>>;
  object?: 'property' | 'unit' | null;
  setObject: React.Dispatch<React.SetStateAction<'property' | 'unit' | null>>;
}

const defaultContextValue: ParentIdContextValue = {
  entityId: null,
  setEntityId: () => {},
  propertyId: null,
  setPropertyId: () => {},
  unitId: null,
  setUnitId: () => {},
  maintenanceId: null,
  setMaintenanceId: () => {},
  object: null,
  setObject: () => {},
};

const ParentIdContext = createContext<ParentIdContextValue>(defaultContextValue);

export default ParentIdContext;
