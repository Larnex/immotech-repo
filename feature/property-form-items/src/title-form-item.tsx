import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export function TitleFormItem() {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.name"))];


  return (
    <FormItem name="title" validators={validators}>
      <TextInput
        label={`${t("entities_details.title")} *`}
        multiline
        numberOfLines={1}
        height={64}
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
