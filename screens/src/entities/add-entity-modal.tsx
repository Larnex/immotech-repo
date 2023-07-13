import {
  BottomSheet,
  BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Text } from "@immotech-component/text";
import { AddEntity } from "@immotech-feature/entity-add";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { BackHandler } from 'react-native';
import { Screens } from "../navigation/screens";

export function AddEntityModal({ onRequestClose }: { onRequestClose: () => void; }) {

  const { t } = useTranslation();


  const [visible, , close] = useOpenClose(true);


  const { push } = useNavigation<any>();

  const handleClose = () => {
    close();
    onRequestClose();

  };

  const navigateOnAdd = React.useCallback((id?: string, title?: string) => {
    push(Screens.EntityDetails, { internalID: id, title });
  }, [push]);

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
    <BottomSheet visible={visible} snapPoints={["90%"]} onClose={handleClose}>
      <BottomSheetScrollView>
        <Stack fill padding="large">
          <Stack horizontal alignCenter fillHorizontal>
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("entities_list.add_new")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer size="small" />
          <AddEntity onSuccess={handleClose} navigate={navigateOnAdd} />
        </Stack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
