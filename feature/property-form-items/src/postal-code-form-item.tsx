import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  value?: string;
}

const validators = [isEmpty("Postal Code is required")];

export function PostalCodeFormItem({ value }: Props) {
  return (
    <FormItem name="postal_code" validators={validators}>
      <TextInput
        defaultValue={value}
        label="Postal Code"
        keyboardType="decimal-pad"
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
