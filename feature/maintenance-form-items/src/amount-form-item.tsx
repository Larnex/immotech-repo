import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  value?: string;
}


export function AmountFormItem({ value }: Props) {
  return (
    <FormItem name="amount">
      <TextInput
        defaultValue={value}
        label="Anzahl"
        keyboardType="decimal-pad"
        placeholderColor={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      />
    </FormItem>
  );
}
