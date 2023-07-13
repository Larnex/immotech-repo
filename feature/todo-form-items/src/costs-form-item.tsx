import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export const CostsFormItem = () => {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.field"))];

  return (
    <FormItem name="costs" validators={validators}>
      <TextInput
        keyboardType="numeric"
        label={`${t("todo.list.cost")} *`}
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

