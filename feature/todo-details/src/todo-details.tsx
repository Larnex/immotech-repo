import { useToDo, useToDoEdit } from "@immotech-feature/todo-api";
import React, { useEffect } from "react";
import { ToDoDetailsView } from "./todo-details-view";
import { useQuery } from "@tanstack/react-query";

interface Props {
  todoID: string;
  parentTitle?: string;
  onSuccess?: () => void;
}

export function ToDoDetails({ todoID, parentTitle, onSuccess }: Props) {
  const { data: todo, error } = useToDo({ nid: todoID });

  const { data, isLoading } = useQuery([`todo:${todoID}`], () => {
    return todo;
  })

  const [dataState, setDataState] = React.useState<any>();

  useEffect(() => {
    setDataState(data);
  }, [data, isLoading]);

  const { mutateAsync: editToDoStatus } = useToDoEdit({
    nid: todoID,
  });

  const onEditToDoStatusTap = async (status: any) => {
    await editToDoStatus({
      ...status,
    });

    onSuccess?.();
  };

  return (
    !isLoading ? (
      <ToDoDetailsView
        todo={dataState}
        loading={isLoading}
        error={error}
        parentTitle={parentTitle}
        onStatusChanged={onEditToDoStatusTap}
      />) : null
  );
}
