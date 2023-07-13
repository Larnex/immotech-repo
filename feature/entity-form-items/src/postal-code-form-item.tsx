import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export function PostalCodeFormItem() {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.zip_code"))];

  return (
    <FormItem name="postalcode" validators={validators}>
      <TextInput
        label={`${t("entities_list.zip_code")} *`}
        keyboardType="decimal-pad"
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
