import { FormItem } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  value: string;
}

export function CountryFormItem({ value }: Props) {
  return (
    <FormItem name="country">
      <TextInput
        defaultValue={value}
        label="Country"
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
