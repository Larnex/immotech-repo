import { Entity, useDeleteEntity, useEntities } from "@immotech-feature/entity-api";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { EntitiesListView } from "./entity-list-view";

import { EntityHorizontalListView } from "./entity-horizontal-list-view";



interface Props {
  onEntitySelect?: (id: string, internalID: string, title?: string) => void;
  onAddEntityTap?: () => void;
  onEditEntityTap?: (id: string) => void;
  onSearchIconTap?: () => void;
  onSortIconTap?: () => void;
  onClearSearchTap?: () => void;
  name?: string;
  internalNumber?: string;
  city?: string;
  zipCode?: string;
  byName?: boolean;
  byNumber?: boolean;
  byZip?: boolean;
  byCity?: boolean;
  showHorizontalScroll?: boolean;
  showFullList?: () => void;
}

export function EntitiesListComponent({
  onEntitySelect,
  onAddEntityTap,
  onEditEntityTap,
  name,
  internalNumber,
  city,
  zipCode,
  onSearchIconTap,
  onSortIconTap,
  onClearSearchTap,
  byName,
  byNumber,
  byZip,
  byCity,
  showHorizontalScroll,
  showFullList
}: Props) {


  const queryClient = useQueryClient();

  const cachedData = queryClient.getQueryCache();

  // const mutationData = queryClient.getMutationCache();
  const { data, isLoading, refetch, error } = useEntities();

  const [entityId, setEntityId] = useState<string | undefined>(undefined);
  const [internalId, setInternalId] = useState<string | undefined>(undefined);

  // Refetch entities
  const [refreshing, setRefreshing] = useState(false);

  // Filter entities
  const [filteredData, setFilteredData] = useState<Entity[]>(data!);

  const [lastClickedItem, setLastClickedItem] = useState<Entity | null>(null);

  const { mutateAsync: deleteEntity } = useDeleteEntity({ nid: entityId, internalID: internalId });


  const filterMethods = [
    (item: Entity) =>
      internalNumber ? item.id?.includes(internalNumber) : item,
    (item: Entity) => (name ? item.title?.includes(name) : item),
    (item: Entity) => (zipCode ? item.zip_code?.includes(zipCode) : item),
    (item: Entity) => (city ? item.city?.includes(city) : item),
  ];

  useEffect(() => {

    setFilteredData(data!);


  }, [isLoading]);

  // useEffect(() => {
  //   if (lastClickedItem) {
  //     const newEntities = filteredData.filter(entity => entity.id !== lastClickedItem.id);
  //     newEntities.unshift(lastClickedItem);
  //     setFilteredData(newEntities);
  //   }
  // }, [lastClickedItem]);

  useEffect(() => {
    let isMounted = true;

    let filteredArray = (data ?? []).reduce(
      (accumulator: Entity[], currentItem: Entity) => {
        for (let i = 0; i < filterMethods.length; i++) {
          if (!filterMethods[i](currentItem)) {
            return accumulator;
          }
        }

        return [...accumulator, currentItem];
      },
      []
    ).map((item: Entity) => {
      const properties = cachedData.findAll([`properties:${item.nid}`])![0] as any;
      const propertiesAmount = properties?.state?.data?.length ?? 0;


      return { ...item, propertiesAmount }
    });

    if (isMounted) {
      setFilteredData(filteredArray);
    }

    return () => {
      isMounted = false;
    }

  }, [name, internalNumber, zipCode, city, data]);

  // Delete Entity

  const onDeleteEntity = useCallback(async (id: string, internalID: string) => {
    setEntityId(id);
    setInternalId(internalID);
    // remove exact entity from cache
    queryClient.setQueryData(['entities'], (oldData: any) => {
      const newData = oldData?.filter((entity: Entity) => id ? entity.nid !== id : entity.id !== internalID);
      return newData;
    });

    queryClient.invalidateQueries([`entity:${internalID}`])
    await deleteEntity();
  }, []);



  const onRefresh = React.useCallback(() => {

    refetch();
    setRefreshing(isLoading);
  }, [data, isLoading]);

  return (
    <EntitiesListView
      onSelect={onEntitySelect}
      entities={filteredData as Entity[] ?? []}
      error={error}
      loading={isLoading}
      onAddEntityTap={onAddEntityTap}
      onEditEntityTap={onEditEntityTap}
      onSortIconTap={onSortIconTap}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onDeleteEntityTap={onDeleteEntity}
      searchActive={!!(name || internalNumber || zipCode || city)}
      onSearchIconTap={onSearchIconTap}
      onClearSearchTap={onClearSearchTap}
      byName={byName}
      byNumber={byNumber}
      byZip={byZip}
      byCity={byCity}
    />
  )
}

export const EntitiesList = React.memo(EntitiesListComponent);
