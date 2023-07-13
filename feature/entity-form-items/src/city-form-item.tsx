import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";


export function CityFormItem() {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.city"))]

  return (
    <FormItem name="city" validators={validators}>
      <TextInput
        label={`${t("entities_list.city")} *`}
        multiline
        numberOfLines={3}
        height={64}
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
