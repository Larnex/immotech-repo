import { FormItem, isEmpty, isInvalidEmail } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR_X } from "@immotech-feature/theme";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  disabled?: boolean;
}

const validators = [isEmpty("Email is required"), isInvalidEmail()];

export function UsernameFormItem({ disabled }: Props) {
  return (
    <Stack fillHorizontal height={85}>
      <FormItem name="username" validators={validators}>
        <TextInput
          autoCapitalize="none"
          backgroundColor={COLOR_X.TRANSPARENT}
          disabled={disabled}
          fill
          keyboardType="email-address"
          placeholder="john@doe.com"
          placeholderColor={COLOR.PRIMARY}
          textColor={COLOR.PRIMARY}
        />
      </FormItem>
    </Stack>
  );
}
