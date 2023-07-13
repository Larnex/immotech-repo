import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export const LocationFormItem = () => {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.field"))]
  return (
    <FormItem name="location" validators={validators}>
      <TextInput
        label={`${t("tga.location")} *`}
        numberOfLines={1}
        height={64}
        placeholder={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

