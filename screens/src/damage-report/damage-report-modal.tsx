import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { AddReport } from "@immotech-feature/todo-add";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { Modals } from "../navigation/modals";

export type ReportScreenParamList = {
  [Modals.DamageReport]: {
    id?: string;
    unitId?: string;
    maintenance?: boolean;
  };
};

export function DamageReportModal({ onRequestClose }: { onRequestClose: () => void }) {
  const { t } = useTranslation();

  const { entityId, propertyId, unitId, maintenanceId, object } = React.useContext(ParentIdContext)

  const [visible, , close] = useOpenClose(true);
  const { goBack } = useNavigation();

  const { params } = useRoute<RouteProp<ReportScreenParamList>>();

  const { id, maintenance } = params ?? {};

  function onClose() {
    close();
    onRequestClose();
  }

  return (
    <BottomSheet visible={visible} snapPoints={["90%"]} onClose={onClose}>
      <BottomSheetScrollView
        nestedScrollEnabled={false}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT3}>
              {t("todo.add_new")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <AddReport
            onSuccess={onClose}
            entity={entityId!}
            property={propertyId!}
            unit={unitId!}
            maintenance={maintenanceId!}
            isMaintenance={maintenance ?? false}
          ></AddReport>
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
