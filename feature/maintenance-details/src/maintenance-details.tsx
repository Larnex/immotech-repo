import { useMaintenance } from "@immotech-feature/maintenance-api";
import React, { useEffect } from "react";
import { MaintenanceDetailsView } from "./maintenance-details-view";
import { useQuery } from "@tanstack/react-query"

interface Props {
  maintenanceID: string;
  internalID?: string
  parentTitle?: string;
  type?: string;
  onToDoListTap?: (id?: string, title?: string) => void;
}

export function MaintenanceDetails({
  maintenanceID,
  internalID,
  parentTitle,
  type,
  onToDoListTap,
}: Props) {

  const { data: maintenance, error } = useMaintenance({ nid: maintenanceID, internalID });
  const { data, isLoading } = useQuery([`maintenance:${internalID ?? maintenanceID}`], () => {
    return maintenance;
  })

  const [dataState, setDataState] = React.useState<any>();
  useEffect(() => {
    setDataState(data);
  }, [data, isLoading]);

  return (
    !isLoading ? (
      <MaintenanceDetailsView
        maintenance={maintenance}
        loading={isLoading}
        error={error}
        type={type}
        parentTitle={parentTitle}
        onToDoListTap={onToDoListTap}
      />) : null
  );
}
