import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLOR_X } from "../../theme/src/theme";


export function IdFormItem() {
  const { t } = useTranslation();
  const validators = [isEmpty(t("validators.id"))];
  return (
    <FormItem name="nid" validators={validators}>
      <TextInput
        label="ID *"
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
