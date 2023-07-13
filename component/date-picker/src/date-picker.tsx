import { Text } from "@immotech-component/text";
import { useOpenClose } from "@immotech/util";
import { format } from "date-fns";
import { CalendarIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import RNDatePicker from "react-native-date-picker";
import { COLOR_X } from "../../../feature/theme/src/theme";

const styles = {
  container: {
    width: "100%",
  },
};

interface Props {
  value?: Date;
  onChange?: (value: Date) => void;
}

export function DatePicker({ value = new Date(), onChange }: Props) {
  const [isOpen, open, close] = useOpenClose();
  const date = typeof value === "string" ? new Date(value) : value;
  const onConfirm = React.useCallback(
    (_date: Date) => {
      onChange?.(_date);
      close();
    },
    [close, onChange]
  );

  return (
    <Stack fillHorizontal>
      <Tappable onTap={open} style={styles.container}>
        <Stack
          horizontal
          fillHorizontal
          border
          borderColor={COLOR_X.SECONDARY}
          backgroundColor={COLOR.DIVIDER}
          borderRadius="normal"
          padding={["horizontal:normal", "vertical:normal"]}
        >
          <Stack fill>
            <Text fill textColor={COLOR_X.SECONDARY}>{format(date, "MM-dd-yyyy")}</Text>
          </Stack>
          <Stack>
            <CalendarIcon />
          </Stack>
        </Stack>
      </Tappable>
      <RNDatePicker
        date={date}
        modal
        mode="date"
        maximumDate={new Date()}
        open={isOpen}
        onConfirm={onConfirm}
        onCancel={close}
      />
    </Stack>
  );
}
