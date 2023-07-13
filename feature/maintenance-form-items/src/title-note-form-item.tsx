import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  onTitleChange?: (title: string) => void;
  value?: string;
}

export const TitleNoteFormItem = (
  { onTitleChange, value }: Props
) => {
  return (
    <TextInput
      label="Title"
      numberOfLines={1}
      height={64}
      placeholder={COLOR.TERTIARY}
      borderColor={COLOR.TERTIARY}
      backgroundColor={COLOR.DIVIDER}
      onChangeText={onTitleChange}
      value={value}
    ></TextInput>
  );
};

