import { useAddEntity } from "@immotech-feature/entity-api";
import React from "react";
import { AddEntityForm, AddEntityParams } from "./add-entity-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNetInfo } from "@react-native-community/netinfo";

interface Props {
  onSuccess?: () => void;
  navigate: (id?: string, title?: string) => void;

}

export function AddEntity({ onSuccess, navigate }: Props) {
  const queryCache = useQueryClient()
  const updateEntity = useAddEntity();
  const { mutate: addEntity, isLoading, error } = useAddEntity();

  const onAddEntityTap = async (entity: AddEntityParams) => {
    // add data to cache
    queryCache.setQueryData(['entities'], (old: any) => {
      return [...old,
      {
        title: entity.title,
        city: entity.field_account_entity_city.und[0].value,
        id: entity.field_account_entity_id.und[0].value,
        zip_code: entity.field_account_entity_postalcode.und[0].value,
      }]
    })


    queryCache.setQueryData([`entity:${entity.field_account_entity_id.und[0].value}`], () => {
      return { ...entity }
    })

    addEntity({ ...entity }, {
      onError(error) {
        console.error("add-entity:", error);
      }
    });

    // navigate(entity?.field_account_entity_id.und?.[0]?.value, entity.title)

    onSuccess?.();
  };

  return (
    <AddEntityForm
      entityFormLoading={isLoading}
      onSubmit={onAddEntityTap}
      error={error}
    />
  );
}
