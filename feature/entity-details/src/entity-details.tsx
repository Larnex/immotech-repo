import React from "react";
import { EntityDetailsView } from "./entity-details-view";
import { useQuery } from "@tanstack/react-query"
import { useEntity } from "@immotech-feature/entity-api";

interface Props {
  entityId: string;
  onAddEntityTap?: () => void;
  internalID: string;
}

export function EntityDetails({ entityId, onAddEntityTap, internalID }: Props) {
  const { data: entityDetails } = useEntity({ nid: entityId, internalID });
  const { data, isLoading, error } = useQuery([`entity:${entityId ?? internalID}`], () => {
    return entityDetails
  })
  return (
    !isLoading ? (
      <EntityDetailsView
        entity={entityDetails}
        loading={isLoading}
        error={error as Error}
        entityId={entityId}
      />
    ) : null
  );
}
