import { UnitResponse, useDeleteUnit, useUnits, useUnitsByProperty } from "@immotech-feature/unit-api";
import { usePrevious } from "@immotech/util";
import { useNetInfo } from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { UnitHorizontalListView } from "./unit-horizontal-list-view";
import UnitListView from "./unit-list-view";
import { PropertyListResponse } from "../../property-api/src/use-property";

interface Props {
  propertyId?: string;
  onAddUnitTap?: () => void;
  onSelectUnit?: (id: string, internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
  onEditUnitTap?: (id: string) => void;
  onAddDamageTap?: () => void;
  onAddMaintenanceTap?: () => void;
  internalNumber?: string;
}

export function UnitListComponent({
  propertyId,
  onAddUnitTap,
  onSelectUnit,
  onEditUnitTap,
  onAddDamageTap,
  onAddMaintenanceTap,
  internalNumber,
}: Props) {
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();

  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const cachedData = queryClient.getQueryCache();

  const [refreshing, setRefreshing] = React.useState(false);
  const [unitId, setUnitId] = React.useState<string | undefined>(undefined);
  const [internalUnitID, setInternalUnitID] = React.useState<string | undefined>(undefined);
  const isMounted = React.useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, [])



  // const { data: units, error, refetch, isLoading } = useUnitsByProperty({ nid: propertyId, internalID: internalNumber });

  const { data: units, error, refetch, isLoading } = (propertyId || internalNumber) ? useUnitsByProperty({ nid: propertyId, internalID: internalNumber }) : useUnits();
  const [data, setData] = React.useState(units);


  const { mutateAsync: deleteUnit } = useDeleteUnit({
    nid: unitId,
  });

  useEffect(() => {

    if (units) {
      const mutatedUnits = units?.map((item: UnitResponse) => {
        const maintenancesItem = cachedData.findAll([`maintenancesbyUnit:${item.nid}`])![0] as any;
        const maintenancesAmount = maintenancesItem?.state?.data?.length ?? 0;

        const todosItem = cachedData.findAll([`todosbyUnit:${item.nid}`])![0] as any;
        const todosAmount = todosItem?.state?.data?.length ?? 0;

        const parentName = cachedData.find<PropertyListResponse>([`property:${item.parent_id}`])?.state?.data?.title;

        return { ...item, maintenancesAmount, todosAmount, parentName }
      });

      const dataWithAssignedEntity = mutatedUnits.filter(item => item.parent_id !== null);

      setData(dataWithAssignedEntity as any);
    }


  }, [units, cachedData])

  // useEffect(() => {
  //   if (!prevIsFocused && isFocused) {
  //     refetch();
  //   }
  // }, [isFocused, prevIsFocused]);

  const onDeleteUnitTap = useCallback(async (id: string, internalUnitID: string, parentId?: string) => {
    setUnitId(id);
    setInternalUnitID(internalUnitID);

    queryClient.setQueryData([`units:${parentId}`], (oldData: any) => {
      const newData = oldData?.filter((unit: UnitResponse) => id ? unit.nid !== id : unit.id !== internalUnitID);

      return newData;
    });
    queryClient.invalidateQueries([`units:${propertyId ?? parentId}`]);

    queryClient.removeQueries([`unit:${id ?? internalUnitID}`]);

    await deleteUnit();
    if (isMounted.current) {
      setData(prevFilteredData => prevFilteredData?.filter(item => item.nid !== id));
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    refetch();
    setRefreshing(isLoading);
  }, [data, isLoading]);

  return (
    !isLoading ? (
      <UnitListView
        units={data as UnitResponse[] ?? []}
        error={error}
        loading={isLoading}
        onSelect={onSelectUnit}
        onAddUnitTap={onAddUnitTap}
        onEditUnitTap={onEditUnitTap}
        onAddDamageTap={onAddDamageTap}
        onAddMaintenanceTap={onAddMaintenanceTap}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onDeleteUnit={onDeleteUnitTap}
      ></UnitListView>
    ) : null);
}

export const UnitList = React.memo(UnitListComponent);
