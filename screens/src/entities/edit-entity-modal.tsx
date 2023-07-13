import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { EditEntity } from "@immotech-feature/entity-edit";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modals } from "../navigation/modals";

type EditEntityModalParamList = {
  [Modals.EditEntity]: {
    id: string;
  };
};

export function EditEntityModal() {
  const { t } = useTranslation();
  const [visible, , close] = useOpenClose(true);

  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<EditEntityModalParamList>>();

  return (
    <BottomSheet visible={visible} snapPoints={["90%"]} onClose={goBack}>
      <BottomSheetScrollView>
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("edit.entity")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <EditEntity id={params.id} onSuccess={close} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
