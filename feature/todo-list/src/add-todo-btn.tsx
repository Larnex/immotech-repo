import { COLOR_X } from "@immotech-feature/theme";
import { AddCircleIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React from "react";

interface Props {
  onAddToDoTap?: () => void;
}

const AddToDoBtn = ({ onAddToDoTap }: Props) => {
  return (
    <Stack
      padding={["vertical:small", "horizontal:normal"]}
      horizontal
      fillHorizontal
      justifyAround
    >
      <Tappable onTap={onAddToDoTap}>
        <AddCircleIcon color={COLOR_X.TO_DO_HEADER} size={60} />
      </Tappable>
    </Stack>
  );
};

export default AddToDoBtn;
