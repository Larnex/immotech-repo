import { ThreeDModels, usePropertyTypes } from "@immotech-feature/property-api";
import { useUnit } from "@immotech-feature/unit-api";
import React, { useEffect } from "react";
import { UnitDetailsView } from "./unit-details-view";
import { useQuery } from "@tanstack/react-query";

interface Props {
  unitId: string;
  onOpenMap: (lon: string, lat: string) => void;
  onToDoListTap?: (propertyID?: string, id?: string, internalID?: string, title?: string) => void;
  onMaintenanceListTap?: (propertyID?: string, id?: string, title?: string) => void;
  getModels: (data: ThreeDModels[]) => void;
  internalID: string;
}

export function UnitDetails({
  unitId,
  onOpenMap,
  onToDoListTap,
  onMaintenanceListTap,
  getModels,
  internalID
}: Props) {
  const { data: unit, error } = useUnit({ nid: unitId, internalID, object: 'unit' });

  const { data, isLoading } = useQuery([`unit:${unitId ? unitId : internalID}`], () => {
    return unit;
  });

  const { data: types } = usePropertyTypes();

  useEffect(() => {
    if (data?.field_3d_models) {
      getModels(data.field_3d_models.und as ThreeDModels[]);
    }
  }, [data]);

  return (
    !isLoading ? (
      <UnitDetailsView
        unit={data}
        loading={isLoading}
        error={error}
        onOpenMap={onOpenMap}
        types={types}
        onToDoListTap={onToDoListTap}
        onMaintenanceListTap={onMaintenanceListTap}
      ></UnitDetailsView>
    ) : null
  );
}
