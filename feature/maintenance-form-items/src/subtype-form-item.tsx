import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";


export const SubTypeFormItem = () => {
  return (
    <FormItem name="subtype">
      <TextInput
        label="Subtyp"
        numberOfLines={1}
        height={64}
        placeholder={COLOR.TERTIARY}
        borderColor={COLOR.TERTIARY}
        backgroundColor={COLOR.DIVIDER}
      ></TextInput>
    </FormItem>
  );
};

