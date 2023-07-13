import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { COLOR_X } from "@immotech-feature/theme";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";

interface Props {
  disabled?: boolean;
}

const validators = [isEmpty("Password is required")];

export function PasswordFormItem({ disabled }: Props) {
  return (
    <Stack height={85} fillHorizontal>
      <FormItem name="password" validators={validators}>
        <TextInput
          backgroundColor={COLOR_X.TRANSPARENT}
          disabled={disabled}
          fill
          keyboardType="ascii-capable"
          password
          placeholder="password"
          placeholderColor={COLOR_X.PRIMARY}
          textColor={COLOR.PRIMARY}
        />
      </FormItem>
    </Stack>
  );
}
