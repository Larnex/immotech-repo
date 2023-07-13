import { ThreeDModels, useAttributes, useProperty, usePropertyTypes } from "@immotech-feature/property-api";
import React, { useEffect } from "react";
import { PropertyDetailsView } from "./property-details-view";

interface Props {
  propertyId: string;
  onOpenMap: (lon: string, lat: string) => void;
  onToDoListTap?: (internalID: string, id?: string, title?: string) => void;
  onMaintenanceListTap?: (internalID: string, id?: string, title?: string) => void;
  getModels: (data: ThreeDModels[]) => void;
  internalID?: string;
  showFullInfo?: boolean;
}

function PropertyDetailsComponent({
  propertyId,
  onOpenMap,
  onToDoListTap,
  onMaintenanceListTap,
  internalID,
  getModels,
  showFullInfo,
}: Props) {
  const { data, isLoading, error } = useProperty({ nid: propertyId, internalID: internalID, object: 'property' });

  const { data: types } = usePropertyTypes();
  const { data: attributes } = useAttributes();

  useEffect(() => {
    if (data?.field_3d_models && !!data?.field_3d_models?.und?.length) {
      getModels(data?.field_3d_models?.und as ThreeDModels[]);
    }
  }, [data?.field_3d_models]);

  return (
    !isLoading ? (
      <PropertyDetailsView
        property={data}
        loading={isLoading}
        error={error as Error}
        propertyId={propertyId}
        types={types}
        attributesList={attributes}
        onOpenMap={onOpenMap}
        onToDoListTap={onToDoListTap}
        onMaintenanceListTap={onMaintenanceListTap}
        showFullInfo={showFullInfo}
      />) : null
  );
}

export const PropertyDetails = React.memo(PropertyDetailsComponent);
