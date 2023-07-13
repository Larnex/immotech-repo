import {
  MaintenanceListResponse,
  useDeleteMaintenance,
  useMaintenanceById,
  useMaintenances
} from "@immotech-feature/maintenance-api";
import { useListHooks } from "@immotech/util";
import React, { useCallback, useEffect, useState } from "react";
import { applyFilters } from "./filters";
import { MaintenanceHorizontalListView } from "./maintenance-horizontal-list-view";
import MaintenanceListView from "./maintenance-list-view";

interface Props {
  id?: string;
  onMaintenanceSelect?: (
    id: string,
    internalID?: string,
    assignEntity?: string,
    type?: string) => void;
  type?: string;
  onFilterIconTap?: () => void;
  filterHeaderActive?: boolean;
  onSearchIconTap?: () => void;
  name?: string;
  manufacturer?: string;
  onClearSearchTap?: () => void;
  onEditMaintenanceTap?: (id: string) => void;
  onAddProtocolTap?: (id: string, newProtocol: boolean) => void;
  onOpenProtocolsPdfTap?: (id: string) => void;
  onAddMaintenanceTap?: () => void;
  onSortIconTap?: () => void;
  byMaintenanceName?: boolean;
  byType?: boolean;
  byDateStart?: boolean;
  byDateEnd?: boolean;
  internalID?: string;
  object?: "property" | "unit";
  parentName?: string
}

export function MaintenanceListComponent({
  id,
  type,
  onMaintenanceSelect,
  onFilterIconTap,
  filterHeaderActive,
  onClearSearchTap,
  onEditMaintenanceTap,
  onSearchIconTap,
  name,
  manufacturer,
  onAddProtocolTap,
  onOpenProtocolsPdfTap,
  onAddMaintenanceTap,
  onSortIconTap,
  byMaintenanceName,
  byType,
  byDateStart,
  byDateEnd,
  internalID,
  object,
  parentName
}: Props) {
  const { isFocused, queryClient, prevIsFocused, netInfo } = useListHooks();

  // get all cached data
  const cachedData = queryClient.getQueryCache();

  const [refreshing, setRefreshing] = useState(false);

  const [maintenanceId, setMaintenanceId] = useState<string | undefined>(
    undefined
  );

  const [internalMaintenanceID, setInternalMaintenanceID] = useState<string | undefined>(undefined);

  const { data: maintenances, error, refetch, isLoading } = (id || internalID)
    ? useMaintenanceById({ nid: id, internalID, object })
    : useMaintenances();
  // const { data, refetch: refetchCache } = useQuery([object === "property" ? `maintenancesbyProperty:${internalID}` : object === "unit" ? `maintenancesbyUnit:${internalID}` : "maintenances"], () => {

  //   const cachedData = queryClient.getQueryData([object === "property" ? `maintenancesbyProperty:${internalID}` : object === "unit" ? `maintenancesbyUnit:${internalID}` : "maintenances"]);

  //   if (cachedData && !netInfo.isConnected) {
  //     return cachedData;
  //   }

  //   return maintenances;
  // });

  const { mutateAsync: deleteMaintenance } = useDeleteMaintenance({
    nid: maintenanceId,
  });

  // const [data, setData] = useState<MaintenanceListResponse[] | [] | undefined>(maintenances);

  // const addTodosAmount = (maintenances: MaintenanceListResponse[] | undefined): MaintenanceListResponse[] => {
  //   return maintenances!.map((item) => {
  //     const todosItem = cachedData.findAll([`todosbyMaintenance:${item.nid}`])![0] as any;
  //     const todosAmount = todosItem?.state?.data?.length ?? 0;

  //     return {
  //       ...item,
  //       todosAmount
  //     }
  //   });
  // };


  const filteredData = React.useMemo(() => applyFilters(maintenances ?? [], {
    type: type,
    name: name,
    parentName: parentName
  }), [maintenances, type, name, parentName]);

  // const modifiedData = React.useMemo(() => addTodosAmount(filteredData), [filteredData]);


  const onDeleteMaintenanceTap = useCallback(async (id: string, internalMaintenanceID: string) => {
    setMaintenanceId(id);
    setInternalMaintenanceID(internalMaintenanceID);
    // TODO: fix delete maintenance
    queryClient.setQueryData([internalID ? `maintenance:${internalMaintenanceID}` : `maintenances`], (oldData: any) => {
      // return oldData.filter((item: MaintenanceListResponse) => item.name !== internalMaintenanceID);
      const newData = oldData?.filter((maintenance: MaintenanceListResponse) => id ? maintenance.nid !== id : maintenance.title !== internalMaintenanceID);
      return newData;
    });

    queryClient.invalidateQueries([internalMaintenanceID ? `maintenance:${id ? id : internalMaintenanceID}` : `maintenance`]);

    await deleteMaintenance();
    // setFilteredData(prevFilteredData => prevFilteredData.filter(item => item.nid !== id));

  }, [deleteMaintenance, queryClient]);





  // useEffect(() => {
  //   const filteredArray = applyFilters(maintenances ?? [], {
  //     type,
  //     name,
  //     parentName
  //   });

  //   const modifiedData = addTodosAmount(filteredArray);

  //   const dataWithAssignedEntity = modifiedData.filter(item => item.assigned_entity_id !== null);

  //   // setFilteredData(dataWithAssignedEntity);
  // }, [type, name, manufacturer, parentName]);


  // useEffect(() => {
  //   if (!prevIsFocused && isFocused) {
  //     refetch();
  //     // addTodosAmount(filteredData);
  //   }
  // }, [isFocused, prevIsFocused]);

  const onRefresh = React.useCallback(() => {
    refetch();
    // refetchCache();
    setRefreshing(isLoading);
    // setFilteredData(maintenances!);
  }, [isLoading]);



  return (
    !isLoading ? (
      <MaintenanceListView
        filterHeaderActive={filterHeaderActive}
        searchActive={!!(type || name || manufacturer)}
        maintenance={filteredData as MaintenanceListResponse[] ?? []}
        parentId={id}
        loading={isLoading}
        onSearchIconTap={onSearchIconTap}
        onSelect={onMaintenanceSelect}
        onFilterIconTap={onFilterIconTap}
        onClearSearchTap={onClearSearchTap}
        onEditMaintenanceTap={onEditMaintenanceTap}
        onAddProtocolTap={onAddProtocolTap}
        onOpenProtocolsPdfTap={onOpenProtocolsPdfTap}
        onDeleteMaintenanceTap={onDeleteMaintenanceTap}
        onAddMaintenanceTap={onAddMaintenanceTap}
        error={error}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onSortIconTap={onSortIconTap}
        byMaintenanceName={byMaintenanceName}
        byType={byType}
        byDateStart={byDateStart}
        byDateEnd={byDateEnd}
      />

    ) : null
  )
}

export const MaintenanceList = React.memo(MaintenanceListComponent)
