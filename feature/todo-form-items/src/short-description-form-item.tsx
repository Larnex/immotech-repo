import { FormItem } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

export const ShortDescriptionFormItem = () => {
  const { t } = useTranslation();

  return (
    <FormItem name="short_description">
      <TextInput
        label={`${t("todo.list.short_desc")}`}
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

