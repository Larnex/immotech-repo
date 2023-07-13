import {
  AddReportFormType,
  useDeleteImage,
  useEditReport,
  useToDo
} from "@immotech-feature/todo-api";
import React from "react";
import { EditReportForm } from "./edit-report-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
  id: string;
}

export const EditReport = ({ onSuccess, id }: Props) => {
  const queryClient = useQueryClient();

  const {
    mutate: editReport,
    isLoading,
    error,
  } = useEditReport({ nid: id });

  const { mutateAsync: deletePicture, error: deleteError } = useDeleteImage({
    nid: id,
  });

  const {
    data,
    isLoading: todoLoading,
    error: todoError,
  } = useToDo({ nid: id });

  const onEditReportTap = (todo: AddReportFormType, id?: string) => {
    queryClient.setQueryData([`todo:${id}`], () => {
      return {
        ...data,
        ...todo,
        field_todo_priority: {
          und: [
            {
              value: todo.field_todo_priority!.und
            }
          ]
        },

        field_todo_status: {
          und: [
            {
              value: todo.field_todo_status!.und
            }
          ]
        }
      }
    })

    editReport({
      ...todo,
    });

    onSuccess?.();
  };

  const onDeletePictureTap = async (pictureToDelete: {
    [key: string]: "delete";
  }) => {

    await deletePicture({
      field_todo_pictures: pictureToDelete,
    }, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries([`todo:${id}`])
      },
    });

    // onSuccess?.();
  };

  return !todoLoading ? (
    <EditReportForm
      todo={data}
      onSubmit={onEditReportTap}
      error={error}
      todoFormLoading={isLoading}
      onDeletePicture={onDeletePictureTap}
    />
  ) : null;
};

