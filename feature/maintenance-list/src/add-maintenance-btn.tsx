import { COLOR_X } from "@immotech-feature/theme";
import { AddCircleIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React from "react";

interface Props {
  onAddMaintenanceTap?: () => void;
}

const AddMaintenanceBtn = ({ onAddMaintenanceTap }: Props) => {
  return (
    <Stack
      padding={["vertical:small", "horizontal:normal"]}
      horizontal
      fillHorizontal
      justifyAround
    >
      <Tappable onTap={onAddMaintenanceTap}>
        <AddCircleIcon color={COLOR_X.MAINTENANCE_HEADER} size={60} />
      </Tappable>
    </Stack>
  );
};

export default AddMaintenanceBtn;
