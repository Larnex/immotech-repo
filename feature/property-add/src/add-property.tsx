import { useAddProperty } from "@immotech-feature/property-api";
import React from "react";
import { AddPropertyForm, AddPropertyParams } from "./add-property-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id?: string;
  internalID?: string;
  onSuccess?: () => void;
  navigate: (id?: string, title?: string, parentId?: string) => void;
}

export function AddProperty({ id, onSuccess, internalID, navigate }: Props) {
  const queryCache = useQueryClient()
  const updateProperty = useAddProperty();
  const { mutate: addProperty, isLoading, error } = useAddProperty();

  const onAddPropertyTap = (property: AddPropertyParams) => {
    queryCache.setQueryData([`properties:${property?.field_property_accounting_entity}`], (old: any) => {
      return old ? [...old,
      {
        title: property.title,
        city: property.field_property_address.und[0].locality,
        zip_code: property.field_property_address.und[0].postal_code,
        id: property.field_property_id.und[0].value,
      }] : [{
        title: property.title,
        city: property.field_property_address.und[0].locality,
        zip_code: property.field_property_address.und[0].postal_code,
        id: property.field_property_id.und[0].value,
      }]
    });

    queryCache.setQueryData(["properties"], (old: any) => {
      return old ? [...old,
      {
        title: property.title,
        city: property.field_property_address.und[0].locality,
        zip_code: property.field_property_address.und[0].postal_code,
        id: property.field_property_id.und[0].value,
      }] : [{
        title: property.title,
        city: property.field_property_address.und[0].locality,
        zip_code: property.field_property_address.und[0].postal_code,
        id: property.field_property_id.und[0].value,
      }]
    });

    queryCache.setQueryData([`property:${property.field_property_id.und[0].value}`], () => {
      return { ...property }
    });
    addProperty({
      ...property,
    });

    // navigate(property?.field_property_id?.und?.[0]?.value, property?.title, property?.field_property_accounting_entity);

    onSuccess?.();
  };

  return (
    <AddPropertyForm
      propertyFormLoading={isLoading}
      onSubmit={onAddPropertyTap}
      entityId={id}
      error={error}
    />
  );
}
