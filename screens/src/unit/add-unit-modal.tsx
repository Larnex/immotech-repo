import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { AddUnit } from "@immotech-feature/unit-add";
import { useUnitsByProperty } from "@immotech-feature/unit-api";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { Modals } from "../navigation/modals";
import { BackHandler } from 'react-native';
import { Screens } from "../navigation/screens";

type AddUnitModalParamList = {
  [Modals.AddUnit]: {
    id: string;
    internalID: string;
  };
};

export function AddUnitModal({ onRequestClose }: { onRequestClose: () => void }) {
  const { entityId, propertyId } = React.useContext(ParentIdContext);
  const { t } = useTranslation();

  const [visible, , close] = useOpenClose(true);

  const { params } = useRoute<RouteProp<AddUnitModalParamList>>();

  const { push } = useNavigation<any>();

  const { id, internalID } = params ?? {}
  const { refetch } = useUnitsByProperty({
    nid: id,
  });

  function handleClose() {
    refetch();
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
    push(Screens.UnitDetails, {
      internalID: id, title, object: "unit", parentId
    });
  }, [push])

  // TODO: delete id prop

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={handleClose}>
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("unit.add_new")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <AddUnit entityId={entityId} propertyId={propertyId} id={id} onSuccess={handleClose} internalID={internalID} navigate={navigateOnAdd} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
