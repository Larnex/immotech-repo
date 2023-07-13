import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { MaintenanceDetails } from "@immotech-feature/maintenance-details";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoList } from "@immotech-feature/todo-list";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Screens } from "../navigation/screens";
import ToDosHome from "../todos/todos-home";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { Tappable } from "native-x-tappable";
import { PencilIcon } from "native-x-icon";
import { Modals } from "../navigation/modals";
import { navigateToToDoList } from "@immotech/util";


type MaintenanceDetailsParamList = {
  [Screens.MaintenanceDetails]: { id: string; internalMaintenanceID: string, title?: string; type?: string };
};

export function MaintenanceDetailsScreen() {
  console.log("MAINTENANCE DETAILS");
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<MaintenanceDetailsParamList>>();

  const { id, internalMaintenanceID, title, type } = params ?? {};

  const { setMaintenanceId } = React.useContext(ParentIdContext);


  React.useEffect(() => {
    setMaintenanceId(id);
  }, [])

  const navigateToToDoListScreenTap = navigateToToDoList(navigation);

  const openEditMaintenanceModal = useCallback((id: string) => {
    navigation.navigate(Modals.EditMaintenance, { id });
  }, [id, navigation.navigate])

  return (
    <Screen backgroundColor={COLOR.PRIMARY} withSafeArea>
      <PageHeader showBackButton hideGlobalSearch rightButton={
        <Tappable onTap={() => openEditMaintenanceModal(id)}>
          <PencilIcon color={COLOR_X.BLACK} />
        </Tappable>
      }>
        <Stack alignMiddle alignCenter padding={["vertical:small"]} style={{ flexGrow: 1, maxWidth: "80%" }}>
          <Text alignCenter textColor={COLOR_X.SECONDARY} fontSize="large" bold >
            {t("main.maintenance")}: {internalMaintenanceID}
          </Text>
        </Stack>
      </PageHeader>
      <Stack fill backgroundColor={COLOR_X.PRIMARY} padding="vertical:x-small">
        <MaintenanceDetails
          maintenanceID={id}
          parentTitle={title}
          type={type}
          onToDoListTap={navigateToToDoListScreenTap}
          internalID={internalMaintenanceID}
        />

        <ToDosHome />
      </Stack>
    </Screen >
  );
}
