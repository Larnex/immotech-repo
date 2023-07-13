import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { AddMaintenance } from "@immotech-feature/maintenance-add";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { BackHandler } from 'react-native';
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";

export type AddMaintenanceModalScreen = {
  [Modals.AddMaintenance]: { id?: string; unitId?: string, internalID: string, object?: "unit" | "property" };
};

export function AddMaintenanceModal({ onRequestClose }: { onRequestClose: () => void }) {
  const { entityId, propertyId, unitId, object } = React.useContext(ParentIdContext)
  const { t } = useTranslation();

  const [visible, , close] = useOpenClose(true);

  const { goBack, push } = useNavigation<any>();

  const { params } = useRoute<RouteProp<AddMaintenanceModalScreen>>();

  const { id, internalID } = params ?? {};


  function handleClose() {
    close();
    onRequestClose();
  }

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const navigateOnAdd = React.useCallback((id?: string, title?: string, parentId?: string) => {
    push(Screens.MaintenanceDetails, {
      id, internalMaintenanceID: title, title
    });
  }, [push])

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={handleClose}>
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        scrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT3}>
              {t("tga.add_new")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <AddMaintenance
            onSuccess={handleClose}
            entityId={entityId!}
            property={propertyId!}
            unit={unitId!}
            internalID={internalID}
            object={object!}
            navigate={navigateOnAdd}
          ></AddMaintenance>
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
