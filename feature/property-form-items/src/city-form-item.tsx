import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  value?: string;
}

const validators = [isEmpty("City is required")];

export function CityFormItem({ value }: Props) {
  // if no internet connection then validators are empty
  

  return (
    <FormItem name="city" validators={validators}>
      <TextInput
        defaultValue={value}
        value={value}
        label="City"
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
