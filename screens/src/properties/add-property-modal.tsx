import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { AddProperty } from "@immotech-feature/property-add";
import { COLOR_X } from "@immotech-feature/theme";
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

type AddPropertyModalParamList = {
  [Modals.AddProperty]: {
    id?: string;
    internalID?: string;
    parentId?: string
  };
};

export function AddPropertyModal({ onRequestClose }: { onRequestClose: () => void }) {
  const [visible, , close] = useOpenClose(true);

  const { t } = useTranslation();

  const { params } = useRoute<RouteProp<AddPropertyModalParamList>>();

  const { push } = useNavigation<any>();

  const { id, internalID } = params ?? {};
  const { entityId } = React.useContext(ParentIdContext);

  function handleClose() {
    close();
    onRequestClose();
  };

  const navigateOnAdd = React.useCallback((id?: string, title?: string, parentId?: string) => {
    push(Screens.PropertyDetails, {
      internalID: id, title, object: "property", parentId
    });
  }, [push])

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <BottomSheet visible={visible} snapPoints={["100%"]} onClose={handleClose}>
      <BottomSheetScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
      >
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("properties_list.add_new")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <AddProperty id={!!id ? id : entityId!} onSuccess={handleClose} navigate={navigateOnAdd} internalID={!!internalID ? internalID : entityId!} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
