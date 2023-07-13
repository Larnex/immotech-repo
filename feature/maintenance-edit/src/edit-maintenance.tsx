import React from "react";

import {
  MaintenanceFormType,
  MaintenanceResponse,
  useDeleteImage,
  useEditMaintenance,
  useMaintenance,
  useMepTypes
} from "@immotech-feature/maintenance-api";
import { EditMaintenanceForm } from "./edit-maintenance-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
  id: string;
}

export const EditMaintenance = ({ onSuccess, id }: Props) => {
  const queryClient = useQueryClient();

  const [internalID, setInternalID] = React.useState<string | undefined>(undefined);

  const {
    mutate: editMaintenance,
    isLoading,
    error,
  } = useEditMaintenance({ nid: id, internalID });

  const { data: mepTypes } = useMepTypes();

  const { mutateAsync: deletePicture, error: deleteError } = useDeleteImage({
    nid: id,
  });

  const { data, isLoading: maintenanceLoading } = useMaintenance({
    nid: id,
    internalID: internalID,
  });


  // TODO: fix maintenance edit
  const onEditMaintenanceTap = (maintenance: MaintenanceFormType) => {
    setInternalID(maintenance.field_buildingservice_name.und[0].value);

    // update maintenance in the cache
    queryClient.setQueryData([`maintenance:${internalID}`], () => {
      return {
        ...data,
        ...maintenance,
        field_buildingservice_type: {
          und: [
            {
              tid: maintenance.field_buildingservice_type!.und[0],
            }
          ]
        }
      };
    });

    editMaintenance({
      ...maintenance,
    });

    onSuccess?.();
  };

  const onDeletePictureTap = async (pictureToDelete: {
    [key: string]: "delete";
  }) => {

    await deletePicture({
      field_buildingservice_pictures: pictureToDelete,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries([`maintenance:${id ? id : internalID}`])
      }
    });

    // onSuccess?.();
  };

  return !maintenanceLoading ? (
    <EditMaintenanceForm
      maintenance={data as MaintenanceResponse}
      onSubmit={onEditMaintenanceTap}
      error={error}
      maintenanceFormLoading={isLoading}
      types={mepTypes}
      onDeletePicture={onDeletePictureTap}
    />
  ) : null;
};

