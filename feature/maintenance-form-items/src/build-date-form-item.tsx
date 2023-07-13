import { DatePicker } from "@immotech-component/date-picker";
import { FormItem } from "@immotech-component/form";
import { Text } from "@immotech-component/text";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLOR_X } from "../../theme/src/theme";

export const BuildDateFormItem = () => {
  const { t } = useTranslation();

  return (
    <Stack fillHorizontal>
      <Text bold textColor={COLOR_X.SECONDARY}>{t("tga.date_installation")}</Text>
      <Spacer size="small" />
      <FormItem name="buildDate">
        <DatePicker />
      </FormItem>
    </Stack>
  );
};

