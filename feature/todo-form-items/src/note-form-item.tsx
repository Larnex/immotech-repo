import { FormItem } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export const NoteFormItem = () => {
  const { t } = useTranslation();

  return (
    <FormItem name="note">
      <TextInput
        label={`${t("todo.details.note")}`}
        multiline
        numberOfLines={2}
        height={128}
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

