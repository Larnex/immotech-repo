import { COLOR_X } from "@immotech-feature/theme";
import { AddCircleIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React from "react";

interface Props {
  onAddUnitBtn?: () => void;
}

const AddUnitBtn = ({ onAddUnitBtn }: Props) => {
  return (
    <Stack
      padding={["vertical:small", "horizontal:normal"]}
      horizontal
      fillHorizontal
      justifyAround
    >
      <Stack
        style={{
          backgroundColor: "#EFF2F7",
          opacity: 0.6,
          borderRadius: 60,
          width: 80,
          height: 80,
        }}
        alignCenter
        alignMiddle
      >
        <Tappable onTap={onAddUnitBtn} style={{ opacity: 1 }}>
          <AddCircleIcon color={COLOR_X.ACCENT1} size={75} />
        </Tappable>
      </Stack>
    </Stack>
  );
};

export default AddUnitBtn;
