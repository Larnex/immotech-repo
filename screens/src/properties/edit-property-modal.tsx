import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { EditProperty } from "@immotech-feature/property-edit";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";

type EditPropertyModalParamList = {
  [Modals.EditProperty]: {
    id: string;
  };
};

export function EditPropertyModal() {
  const [visible, , close] = useOpenClose(true);

  const { goBack } = useNavigation();
  const { params } = useRoute<RouteProp<EditPropertyModalParamList>>();

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={goBack}>
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("edit.property")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <EditProperty id={params.id} onSuccess={close} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
