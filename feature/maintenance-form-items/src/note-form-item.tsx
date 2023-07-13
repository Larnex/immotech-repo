import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onTextChange?: (text: string) => void;
  value?: string;
}


export const NoteFormItem = ({ onTextChange, value }: Props) => {
  const { t } = useTranslation();

  return (
    <TextInput
      label={`${t("todo.details.note")}`}
      multiline
      numberOfLines={2}
      height={128}
      placeholderColor={COLOR.TERTIARY}
      borderColor={COLOR.TERTIARY}
      backgroundColor={COLOR.DIVIDER}
      onChangeText={onTextChange}
      value={value}
    ></TextInput>
  );
};

