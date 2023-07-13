import { FormItem } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export const IssueFormItem = () => {
  const { t } = useTranslation();

  return (
    <FormItem name="description">
      <TextInput
        label={`${t("todo.details.description")}`}
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

