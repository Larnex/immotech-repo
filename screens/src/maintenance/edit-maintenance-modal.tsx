import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { EditMaintenance } from "@immotech-feature/maintenance-edit";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";

type EditMaintenanceParamsList = {
  [Modals.EditMaintenance]: {
    id: string;
  };
};

export function EditMaintenanceModal() {
  const [visible, , close] = useOpenClose(true);

  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<EditMaintenanceParamsList>>();

  function onClose() {
    close();
  }

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={goBack}>
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("edit.maintenance")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <EditMaintenance id={params.id} onSuccess={onClose} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
