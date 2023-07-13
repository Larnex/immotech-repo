import { Button } from "@immotech-component/button";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onAddEntityTap?: () => void;
}

export function EntityActions({ onAddEntityTap }: Props) {
  const { t } = useTranslation();

  return (
    <Stack
      padding={["vertical:normal", "horizontal:normal"]}
      horizontal
      fillHorizontal
      justifyAround
    >
      <Button
        width={"100%"}
        outline
        size="small"
        rounded={false}
        border
        textColor={COLOR.ACCENT}
        borderColor={COLOR.ACCENT}
        onTap={onAddEntityTap}
      >
        {/* Add Business Entity */}
        {`${t("entities_list.add_new")}`}
      </Button>
    </Stack>
  );
}
