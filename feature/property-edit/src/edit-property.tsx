import { EmptyMessage } from "@immotech-component/data-view";
import { PropertyInputType, useEditProperty, useProperty } from "@immotech-feature/property-api";
import React from "react";
import { EditPropertyForm, EditPropertyParams } from "./edit-property-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
  onSuccess?: () => void;
}

export function EditProperty({ id, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryCache();
  const [internalID, setInternalID] = React.useState<string | undefined>(undefined);

  const {
    mutate: editProperty,
    isLoading,
    error,
  } = useEditProperty({ nid: id, internalID });



  const { data, isLoading: loading } = useProperty({ nid: id });

  const onEditPropertyTap = (property: PropertyInputType, id?: string) => {
    setInternalID(property.field_property_id.und[0].value);

    queryClient.setQueryData([`property:${id ? id : internalID}`], () => {
      return {
        ...data,
        ...property,
        field_property_type: {
          und: [
            {
              tid: property.field_property_type!.und[0]
            }
          ]
        }
      }
    });

    editProperty({
      ...property,
    });

    onSuccess?.();
  };

  return !loading ? (
    <EditPropertyForm
      onSubmit={onEditPropertyTap}
      error={error}
      property={data}
      editPropertyFormLoading={isLoading}
    />
  ) : (
    <EmptyMessage title="Loading...">Loading...</EmptyMessage>
  );
}
