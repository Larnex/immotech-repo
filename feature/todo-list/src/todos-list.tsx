import {
  ToDoListResponse,
  useDeleteToDo,
  useToDos,
  useToDosById
} from "@immotech-feature/todo-api";
import { useListHooks, usePrevious } from "@immotech/util";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import ToDoListView from "./todos-list-view";
import { useQuery } from "@tanstack/react-query";
import { ToDosHorizontalListView } from "./todos-horizontal-list-view";

interface Props {
  filterHeaderActive?: boolean;
  parentId?: string;
  internalID?: string;
  cost?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: string;
  urgency?: string;
  nid?: string;
  to?: string;
  from?: string;
  onToDoSelect?: (id: string, title?: string) => void;
  onEditToDoTap?: (id: string) => void;
  onSearchIconTap?: () => void;
  onClearSearchTap?: () => void;
  onFilterIconTap?: () => void;
  onAddToDoTap?: () => void;
  onSortIconTap?: () => void;
  byToDoName?: boolean;
  byCostHigh?: boolean;
  byCostLow?: boolean;
  byUrgency?: boolean;
  byStatus?: boolean;
  parentName?: string;
  navigateFromProtocol?: boolean;
}

export function ToDoListComponent({
  filterHeaderActive,
  parentId,
  internalID,
  shortDescription,
  longDescription,
  nid,
  status,
  urgency,
  to,
  from,
  onToDoSelect,
  onEditToDoTap,
  onSearchIconTap,
  onClearSearchTap,
  onFilterIconTap,
  onAddToDoTap,
  onSortIconTap,
  byToDoName,
  byCostHigh,
  byCostLow,
  byUrgency,
  byStatus,
  navigateFromProtocol,
  parentName
}: Props) {
  const { isFocused, queryClient, prevIsFocused, netInfo } = useListHooks();

  const cachedData = queryClient.getQueryCache();

  const [todoID, setTodoID] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);


  // TODO: in order to search by long desc it should be added to the list
  const { data, refetch, error, isLoading } = (parentId || internalID) ? useToDosById({
    nid: parentId,
    internalID: internalID
  }) : useToDos();
  const { mutateAsync: deleteToDo } = useDeleteToDo();

  const [dataState, setDataState] = React.useState<any>(data);
  const [filteredData, setFilteredData] = React.useState<ToDoListResponse[]>(data!);
  const filterMethods = [
    (item: ToDoListResponse) => (status ? item?.status == status : item),
    (item: ToDoListResponse) => (urgency ? item?.priority == urgency : item),
    (item: ToDoListResponse) => (from ? item?.created >= from : item),
    (item: ToDoListResponse) => (to ? item?.created <= to : item),
    (item: ToDoListResponse) =>
      shortDescription
        ? item?.short_description?.includes(shortDescription)
        : item,
    (item: ToDoListResponse) => (nid ? item?.nid == nid : item),
    (item: ToDoListResponse) => (parentName ? item?.assigned_entity_title.includes(parentName) : item)
  ];

  useEffect(() => {

    setFilteredData(data!);
  }, [data, isLoading]);

  // useEffect(() => {
  //   if (!prevIsFocused && isFocused) {
  //     refetch();
  //   }
  // }, [isFocused, prevIsFocused]);



  useEffect(() => {
    const filteredArray = (dataState ?? []).reduce(
      (accumulator: ToDoListResponse[], currentItem: ToDoListResponse) => {
        if (navigateFromProtocol && currentItem.status === "done") {
          return accumulator;
        }


        for (let i = 0; i < filterMethods.length; i++) {
          if (!filterMethods[i](currentItem)) {
            return accumulator;
          }
        }
        return [...accumulator, currentItem];
      },
      []
    );

    const modifiedData = addImageToTodoItemList(filteredArray);

    const dataWithAssignedEntity = modifiedData?.filter(item => item.assigned_entity_id !== null);

    setFilteredData(dataWithAssignedEntity!);
  }, [nid, shortDescription, longDescription, to, from, status, urgency, parentName]);


  const addImageToTodoItemList = (todos: ToDoListResponse[] | undefined): ToDoListResponse[] | undefined => {
    return todos?.map((item) => {
      const todosItem = cachedData.findAll([`todo:${item.nid}`])![0] as any;
      const image = !Array.isArray(todosItem?.state?.data?.field_todo_pictures) ? todosItem?.state?.data?.field_todo_pictures.und[0].filename : null;

      return {
        ...item,
        image: image
      }
    })
  }

  const onRefresh = React.useCallback(() => {
    refetch();
    setRefreshing(isLoading);
  }, [data, isLoading]);


  const onDeleteToDoTap = useCallback(async (id: string, internalToDoID: string, parentId?: string) => {

    if (!id || !parentId) {
      console.error("Cannot delete ToDo with undefined ID");
      return;
    }

    setTodoID(id);

    // Define the keys to search in
    // const keys = [
    //   `todosbyMaintenance:${parentId}`,
    //   `todosbyUnit:${parentId}`,
    //   `todosbyProperty:${parentId}`,
    // ];

    // // Loop through the keys and try to find and delete the todo
    // for (const key of keys) {
    //   queryClient.setQueryData([key], (oldData: any) => {
    //     const newData = oldData?.filter((todo: ToDoListResponse) => todo.nid !== id);
    //     // If the length of the data is reduced, that means the item was found and deleted
    //     if (newData && oldData && newData.length < oldData.length) {
    //       
    //       // Invalidate the queries for the deleted todo
    //       queryClient.invalidateQueries([id ? `todo:${id}` : `maintenance`]);
    //       return newData;
    //     }
    //     // If item was not found, do not change the data
    //     return oldData;
    //   });

    //   // Check if todo was deleted from this key, if yes then exit the loop
    //   const updatedData = queryClient.getQueryData([key]);
    //   if (updatedData && updatedData.length < (oldData?.length || 0)) {
    //     break;
    //   }
    // }

    queryClient.setQueryData([`todos`], (oldData: any) => {
      // return oldData.filter((item: MaintenanceListResponse) => item.name !== internalMaintenanceID);
      const newData = oldData?.filter((todo: ToDoListResponse) => todo.nid !== id);
      return newData;
    });

    queryClient.invalidateQueries([id ? `todo:${id}` : `maintenance`]);
    queryClient.invalidateQueries([`todosByMaintenance:${parentId}`, `todosByProperty:${parentId}`, `todosByUnit${parentId}`]);

    await deleteToDo(id);

    setFilteredData(prevFilteredData => prevFilteredData.filter(item => item.nid !== id));
  }, []);

  return (!isLoading ? (
    <ToDoListView
      filterHeaderActive={filterHeaderActive}
      searchActive={!!(nid || shortDescription || parentName || longDescription || status)}
      todos={filteredData ?? []}
      error={error}
      loading={isLoading}
      onSelect={onToDoSelect}
      parentId={parentId}
      onSearchIconTap={onSearchIconTap}
      onClearSearchTap={onClearSearchTap}
      onFilterIconTap={onFilterIconTap}
      onDeleteToDoTap={onDeleteToDoTap}
      onEditToDoTap={onEditToDoTap}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onAddToDoTap={onAddToDoTap}
      onSortIconTap={onSortIconTap}
      byToDoName={byToDoName}
      byCostHigh={byCostHigh}
      byCostLow={byCostLow}
      byUrgency={byUrgency}
      byStatus={byStatus}
    />) : null
  );
}

export const ToDoList = React.memo(ToDoListComponent)
