import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { EditReport } from "@immotech-feature/todo-edit";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";

type EditToDoModalParamList = {
  [Modals.EditDamageReport]: {
    id: string;
  };
};

export function EditToDoModal() {
  const [visible, , close] = useOpenClose(true);

  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<EditToDoModalParamList>>();

  function onClose() {
    close();
  }

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={goBack} >
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("edit.todo")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <EditReport id={params.id} onSuccess={onClose} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
