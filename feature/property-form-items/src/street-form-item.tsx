import { FormItem } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value?: string;
}


export function StreetFormItem({ value }: Props) {
  const { t } = useTranslation();

  return (
    <FormItem name="street">
      <TextInput
        defaultValue={value}
        label={`${t("profile.street")} *`}
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
