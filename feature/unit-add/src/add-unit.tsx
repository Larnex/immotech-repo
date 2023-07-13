import { useProperty, usePropertyTypes } from "@immotech-feature/property-api";
import { useAddUnit } from "@immotech-feature/unit-api";
import React from "react";
import { AddUnitForm, AddUnitParams } from "./add-unit-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
  entityId?: string | null;
  propertyId?: string | null;
  onSuccess?: () => void;
  internalID: string;
  navigate: (id?: string, title?: string, parentId?: string) => void;
}

export function AddUnit({ id, onSuccess, internalID, entityId, propertyId, navigate }: Props) {
  const queryClient = useQueryClient();
  const { mutate: addUnit, isLoading, error } = useAddUnit();

  const { data: types } = usePropertyTypes();

  const onAddUnitTap = (unit: AddUnitParams) => {

    queryClient.setQueryData([`units:${unit?.field_utilization_unit_assign}`], (old: any) => {
      return old ? [...old,
      {
        title: unit.title,
        id: unit.field_utilization_unit_id.und[0].value,
        city: unit.field_utilization_unit_address.und[0].locality,
        zip_code: unit.field_utilization_unit_address.und[0].postal_code,
        parent_id: unit?.field_utilization_unit_assign

      }] : [{
        title: unit.title,
        id: unit.field_utilization_unit_id.und[0].value,
        city: unit.field_utilization_unit_address.und[0].locality,
        zip_code: unit.field_utilization_unit_address.und[0].postal_code,
        parent_id: unit?.field_utilization_unit_assign

      }]
    });

    queryClient.setQueryData(["units"], (old: any) => {
      return old ? [...old,
      {
        title: unit.title,
        id: unit.field_utilization_unit_id.und[0].value,
        city: unit.field_utilization_unit_address.und[0].locality,
        zip_code: unit.field_utilization_unit_address.und[0].postal_code,
        parent_id: unit?.field_utilization_unit_assign


      }] : [{
        title: unit.title,
        id: unit.field_utilization_unit_id.und[0].value,
        city: unit.field_utilization_unit_address.und[0].locality,
        zip_code: unit.field_utilization_unit_address.und[0].postal_code,
        parent_id: unit?.field_utilization_unit_assign

      }]
    });

    queryClient.setQueryData([`unit:${unit.field_utilization_unit_id.und[0].value}`], () => {
      return { ...unit }
    });

    addUnit({
      ...unit
    });

    // navigate(unit?.field_utilization_unit_id?.und?.[0]?.value, unit?.title, unit?.field_utilization_unit_assign)

    onSuccess?.();
  };

  return (
    <AddUnitForm
      entityId={entityId}
      propertyId={propertyId}
      types={types}
      onSubmit={onAddUnitTap}
      error={error}
      unitFormLoading={isLoading}
    />
  );
}
