import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR, useTheme } from "native-x-theme";
import React from "react";
import RNPickerSelect from "react-native-picker-select";

type PickerItem = {
  label: string;
  value: string | number | boolean;
};

interface Props {
  value?: string | number | boolean | null;
  error?: string | Error;
  placeholder?: string;
  items: PickerItem[];
  onChange?: (value: any | number, index: number) => void;
  disable?: boolean;
  backgroundColor?: COLOR | COLOR_X;
}

export function Picker({
  value = '',
  items,
  error,
  onChange,
  placeholder,
  disable,
  backgroundColor,
}: Props) {
  const { getColor } = useTheme();
  const placeholderValue = React.useMemo(
    () => ({ label: placeholder, value: null }),
    [placeholder]
  );
  const fontStyles = React.useMemo(
    () => ({
      fontSize: 16,
      fontFamily: "DM Sans",
      color: getColor(COLOR.SECONDARY),
    }),
    [getColor]
  );
  const pickerStyle = React.useMemo(
    () => ({
      inputIOS: fontStyles,
      inputAndroid: fontStyles,
      placeholder: {
        ...fontStyles,
        color: getColor(COLOR.TERTIARY),
      },
    }),
    [fontStyles, getColor]
  );

  const onValueChange = (_value: any, index: number) => {
    if (_value != null) {
      onChange?.(_value, index);
    }
  };

  return (
    <>
      <Stack
        fillHorizontal
        // fill
        border
        height={48}
        alignMiddle
        borderColor={error ? COLOR.ERROR : COLOR.TERTIARY}
        backgroundColor={backgroundColor ?? COLOR.DIVIDER}
        borderRadius="normal"
        padding="horizontal:normal"
        style={{ position: "relative", zIndex: 100 }}
      >
        <RNPickerSelect
          value={value}
          placeholder={placeholderValue}
          useNativeAndroidPickerStyle={true}
          textInputProps={{}}
          onValueChange={onValueChange}
          items={items}
          style={pickerStyle}
          disabled={disable}
        />
      </Stack>
      {!!error && (
        <Stack>
          <Spacer size="x-small" />
          <Text textColor={COLOR.ERROR}>
            {typeof error === "string" ? error : error?.message}
          </Text>
        </Stack>
      )}
    </>
  );
}
