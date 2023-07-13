import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { ProtocolDataType, ProtocolState } from "@immotech-feature/protocol-api/src";
import { Stack } from "native-x-stack";
import React from "react";
import { AddProtocolForm } from "./add-protocol-form";
import { AddProtocolInfo } from "./add-protocol-info";
import { useQuery, useQueryClient } from "@tanstack/react-query";
interface Props {
  maintenanceNumber: number;
  maintenance: MaintenanceListResponse;
  maintenanceLength: number;
  onBack: () => void;
  onForward: () => void;
  checkedMaintenances: Set<number>;
  onSubmit?: (data: ProtocolDataType, skipped?: boolean, maintenanceNumber?: number, imagesArray?: any[]) => void;
  onTodoTap?: (id: string, internalID: string) => void;
  activeMaintenance?: MaintenanceListResponse;
  onHeightChange: (height: number) => void;
}

export function AddProtocolComponent({
  maintenanceNumber,
  maintenance,
  maintenanceLength,
  onBack,
  onForward,
  checkedMaintenances,
  onSubmit,
  onTodoTap,
  activeMaintenance,
  onHeightChange
}: Props) {
  console.log("🚀 ~ file: add-protocol.tsx:33 ~ activeMaintenance:", activeMaintenance);
  const queryClient = useQueryClient();
  const queryKey = [`protocol:${maintenance.nid}`];

  // check if the key is in the cache then retrieve it using useQuery
  const cachedProtocol = queryClient.getQueryData<ProtocolState | undefined>(queryKey);
  console.log("🚀 ~ file: add-protocol.tsx:39 ~ cachedProtocol:", cachedProtocol);

  return (
    <Stack fill>
      <AddProtocolInfo
        maintenance={maintenance}
        maintenanceNumber={maintenanceNumber}
        maintenanceLength={maintenanceLength}
        onBack={onBack}
        onForward={onForward}
        checkedMaintenances={checkedMaintenances}
        onTodoTap={onTodoTap}
        activeMaintenance={activeMaintenance!}
      />

      <AddProtocolForm onSubmit={onSubmit} maintenanceNumber={maintenanceNumber} maintenanceId={maintenance.nid} protocol={cachedProtocol ?? undefined} onHeightChange={onHeightChange} />
    </Stack>
  );
}

export const AddProtocol = React.memo(AddProtocolComponent);
