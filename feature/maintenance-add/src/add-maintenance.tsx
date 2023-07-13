import {
  MaintenanceFormType,
  useAddMaintenance,
  useMepTypes
} from "@immotech-feature/maintenance-api";
import { useProperty } from "@immotech-feature/property-api";
import { useUnit } from "@immotech-feature/unit-api";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AddMaintenanceForm } from "./add-maintenance-form";

interface Props {
  onSuccess?: () => void;
  entityId?: string;
  property?: string;
  unit?: string;
  internalID: string;
  object?: "property" | "unit";
  navigate: (id?: string, title?: string, parentId?: string) => void;

}

export const AddMaintenance = ({ onSuccess, property, unit, internalID, object, entityId, navigate }: Props) => {
  const queryClient = useQueryClient();

  const {
    data: mepTypes,
    isLoading: mepTypesLoading,
    error: mepTypesError,
  } = useMepTypes();

  const { data: unitData } = useUnit({
    nid: unit?.toString(),
    object: object
  });
  const unitId = unit ? (unitData?.nid ?? unitData?.field_utilization_unit_id?.und?.[0].value) : undefined;

  let propertyId;

  if (unitData) {
    if (typeof unitData.field_utilization_unit_assign === 'string') {
      propertyId = unitData.field_utilization_unit_assign;
    } else if (
      Array.isArray(unitData.field_utilization_unit_assign?.und) &&
      unitData.field_utilization_unit_assign.und[0]?.target_id
    ) {
      propertyId = unitData.field_utilization_unit_assign.und[0].target_id;
    } else {
      propertyId = property;
    }
  } else {
    propertyId = property;
  }

  const { data: propertyData, isLoading: propertyLoading } = useProperty({
    nid: unit ? propertyId : property?.toString(), internalID: internalID,
    object: object
  });

  const entity = Array.isArray(propertyData?.field_property_accounting_entity) ? entityId :
    propertyData?.field_property_accounting_entity?.und?.[0]?.target_id;

  const { mutate: addMaintenance, isLoading, error } = useAddMaintenance();
  const onAddMaintenanceTap = (maintenance: MaintenanceFormType) => {
    let queryKey = object === 'property' ? `maintenancesbyProperty:${maintenance?.field_buildingservice_assignment}` : `maintenancesbyUnit:${maintenance?.field_buildingservice_assignment}`;
    queryClient.setQueryData([queryKey], (old: any) => {

      return old ? [...old,
      {
        name: maintenance.field_buildingservice_name.und[0].value,
        type: maintenance.field_buildingservice_type.und[0],
        location: maintenance.field_buildingservice_location!.und![0].value,
        assigned_entity_id: maintenance.field_buildingservice_assignment,
        assigned_entity_type: object === "property" ? "property" : "utilization_unit",
        assigned_entity_title: maintenance.field_buildingservice_assignment
      }] : [{
        name: maintenance.field_buildingservice_name.und[0].value,
        type: maintenance.field_buildingservice_type.und[0],
        location: maintenance.field_buildingservice_location!.und![0].value,
        assigned_entity_id: maintenance.field_buildingservice_assignment,
        assigned_entity_type: object === "property" ? "property" : "utilization_unit",
        assigned_entity_title: maintenance.field_buildingservice_assignment
      }]
    });

    queryClient.setQueryData(["maintenances"], (old: any) => {

      return old ? [...old,
      {
        name: maintenance.field_buildingservice_name.und[0].value,
        type: maintenance.field_buildingservice_type.und[0],
        location: maintenance.field_buildingservice_location!.und![0].value,
        assigned_entity_id: maintenance.field_buildingservice_assignment,
        assigned_entity_type: object === "property" ? "property" : "utilization_unit",
        assigned_entity_title: maintenance.field_buildingservice_assignment
      }] : [{
        name: maintenance.field_buildingservice_name.und[0].value,
        type: maintenance.field_buildingservice_type.und[0],
        location: maintenance.field_buildingservice_location!.und![0].value,
        assigned_entity_id: maintenance.field_buildingservice_assignment,
        assigned_entity_type: object === "property" ? "property" : "utilization_unit",
        assigned_entity_title: maintenance.field_buildingservice_assignment
      }]
    });

    queryClient.setQueryData([`maintenance:${maintenance.field_buildingservice_name.und[0].value}`], () => {
      return { ...maintenance }
    });

    addMaintenance({
      ...maintenance
    });


    // navigate(maintenance?.field_buildingservice_name?.und?.[0]?.value, maintenance?.field_buildingservice_name?.und?.[0]?.value, maintenance?.field_buildingservice_assignment)

    onSuccess?.();
  };

  return (
    <AddMaintenanceForm
      onSubmit={onAddMaintenanceTap}
      typesLoading={mepTypesLoading}
      types={mepTypes}
      error={error}
      entityId={entity}
      propertyId={unitData ? propertyId : property?.toString()}
      unitId={unitId}
      loadingForm={isLoading}
      internalID={internalID}
    />
  );
};

