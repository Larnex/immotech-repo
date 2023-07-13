import {
  getAllProperties,
  PropertyListResponse,
  useDeleteProperty,
  usePropertiesByEntity
} from "@immotech-feature/property-api";
import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState, useEffect } from "react";
import { PropertiesListView } from "./property-list-view";
import { Props } from './property-list.types';
import { calculateDistance, getCoords } from "@immotech/util";
import { applyFilters } from "./filters";


export const PropertiesList = React.memo((props: Props) => {
  const queryClient = useQueryClient();

  const isFocused = useIsFocused();
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const haveDistancesAddedToCache = React.useRef(false);
  const previousPropertiesLength = React.useRef(0);
  const cachedData = queryClient.getQueryCache();
  const { mutateAsync: deleteProperty } = useDeleteProperty({ nid: propertyId });
  const isMounted = React.useRef(true);

  const { data, refetch, error, isLoading } = (props.entityId || props.internalID)
    ? usePropertiesByEntity({ nid: !!props.entityId ? props.entityId : props.internalID, internalID: props.internalID })
    : getAllProperties();


  const onRefresh = React.useCallback(async () => {
    await refetch();
    if (!isLoading) {
      setRefreshing(false);
    }
  }, [data, isLoading]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);


  const filteredData = React.useMemo(() => {
    return applyFilters(
      data?.filter(item => item.parent_id !== null) ?? [],
      {
        internalNumber: props.internalNumber,
        name: props.name,
        nid: props.nid,
        zipCode: props.zipCode,
        city: props.city,
      }
    )
    // .map((item: PropertyListResponse) => {
    //   const maintenancesItem = cachedData.findAll([`maintenancesbyProperty:${item.nid}`])![0] as any;
    //   const maintenancesAmount = maintenancesItem?.state?.data?.length ?? 0;

    //   const todosItem = cachedData.findAll([`todosbyProperty:${item.nid}`])![0] as any;
    //   const todosAmount = todosItem?.state?.data?.length ?? 0;

    //   const unitsItem = cachedData.findAll([`units:${item.nid}`])![0] as any;
    //   const unitsAmount = unitsItem?.state?.data?.length ?? 0;

    //   return { ...item, maintenancesAmount, todosAmount, unitsAmount };
    // });
  }, [data, props.internalNumber, props.name, props.nid, props.zipCode, props.city, cachedData]);




  useEffect(() => {
    getCoords((coordinates) => {
      if (isMounted.current) {
        setCoords(coordinates);
      }
    });
    const debouncingDelay = 300;
    const timeoutId = setTimeout(() => {
      if (!coords || haveDistancesAddedToCache.current) {
        return;
      }



      const distances = filteredData.map((property) => (
        calculateDistance(coords.latitude, coords.longitude, +property.lat!, +property.lon!)
      ));

      const updatedProperties = filteredData.map((property, index) => ({
        ...property,
        distance: distances[index],
      }));

      haveDistancesAddedToCache.current = true;
      queryClient.setQueryData(['properties'], updatedProperties);
    }, debouncingDelay);

    return () => { clearTimeout(timeoutId); isMounted.current = false };
  }, [coords]);


  const onDeleteProperty = useCallback(async (id: string, internalPropertyID: string) => {
    setPropertyId(id);

    if (isMounted.current) {
      queryClient.setQueryData([props.internalID ? `properties:${props.entityId ?? props.internalID}` : `properties`], (oldData: any) => {
        // return oldData.filter((item: PropertyListResponse) => item.id !== internalPropertyID);
        const newData = oldData?.filter((property: PropertyListResponse) => id ? property.nid !== id : property.id !== internalPropertyID);
        return newData;
      });
      queryClient.invalidateQueries([`property:${id ?? internalPropertyID}`]);
    }
    await deleteProperty();
  }, [props.internalID]);


  return (
    !isLoading ? (
      <PropertiesListView
        onSelect={props.onPropertySelect!}
        searchActive={!!(props.name || props.internalNumber || props.zipCode || props.city || props.nid)}
        properties={data ?? []}
        filterHeaderActive={props.filterHeaderActive}
        error={error as Error}
        onSearchIconTap={props.onSearchIconTap}
        onClearSearchTap={props.onClearSearchTap}
        onAddPropertyTap={props.onAddPropertyTap}
        onDeleteProperty={onDeleteProperty}
        onEditPropertyTap={props.onEditPropertyTap}
        loading={isLoading}
        onRefresh={onRefresh}
        refreshing={refreshing}
        parentId={props.entityId}
        onSortIconTap={props.onSortIconTap}
        byName={props.byName}
        byNumber={props.byNumber}
        byZip={props.byZip}
        byCity={props.byCity}
      />
    ) : null);
});
