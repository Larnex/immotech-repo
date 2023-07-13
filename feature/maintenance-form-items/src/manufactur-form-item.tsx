import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";


export const ManufacturFormItem = () => {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.field"))]
  return (
    <FormItem name="manufactur" validators={validators}>
      <TextInput
        label={`${t("tga.manufacturer")} *`}
        numberOfLines={1}
        height={64}
        placeholder={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

