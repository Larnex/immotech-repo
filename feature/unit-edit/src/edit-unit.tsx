import { EmptyMessage } from "@immotech-component/data-view";
import { useEditUnit, useUnit } from "@immotech-feature/unit-api";
import React from "react";
import { EditUnitForm, EditUnitParams } from "./edit-unit-form";

interface Props {
  id: string;
  onSuccess?: () => void;
}

export function EditUnit({ id, onSuccess }: Props) {
  const { mutateAsync: editUnit, error } = useEditUnit({ nid: id });

  const { data: unit, isLoading: loading } = useUnit({ nid: id });

  const onEditUnitTap = async (unit: EditUnitParams) => {
    await editUnit({
      ...unit,
    });

    onSuccess?.();
  };

  return !loading ? (
    <EditUnitForm onSubmit={onEditUnitTap} error={error} unit={unit} />
  ) : (
    <EmptyMessage title="Loading...">Loading...</EmptyMessage>
  );
}
