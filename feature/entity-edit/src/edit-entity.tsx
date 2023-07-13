import { EmptyMessage } from "@immotech-component/data-view";
import { useEditEntity, useEntity } from "@immotech-feature/entity-api";
import React from "react";
import { EditEntityForm, EditEntityType } from "./edit-entity-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
  id: string;
}

export function EditEntity({ id, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const [internalID, setInternalID] = React.useState<string | undefined>(undefined);

  const {
    data,
    isLoading: entityLoading,
    error: entityError,
    refetch: entityRefetch,
  } = useEntity({ nid: id });

  const {
    mutate: editEntity,
    isLoading,
    error,
  } = useEditEntity({ nid: id, internalID });

  const onEditEntityTap = (entity: EditEntityType, id?: string) => {
    setInternalID(entity.field_account_entity_id.und[0].value);

    queryClient.setQueryData([`entity:${id ? id : internalID}`], () => {
      return {
        ...data,
        ...entity,
      }
    });

    editEntity({
      ...entity,
    });

    entityRefetch();

    onSuccess?.();
  };

  return !entityLoading ? (
    <EditEntityForm
      entity={data}
      entityFormLoading={isLoading}
      onSubmit={onEditEntityTap}
      error={error}
    />
  ) : (
    <EmptyMessage title="Loading ...">
      Loading...
    </EmptyMessage>
  );
}
