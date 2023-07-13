import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoDetails } from "@immotech-feature/todo-details";
import { RouteProp, useRoute } from "@react-navigation/core";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { Screens } from "../navigation/screens";
import { Tappable } from "native-x-tappable";
import { PencilIcon } from "native-x-icon";
import { useNavigation } from "@react-navigation/native";
import { Modals } from "../navigation/modals";
type ToDoDetailsParamList = {
  [Screens.ToDoDetails]: { id: string; title?: string };
};

export function ToDoDetailsScreen() {
  const { params } = useRoute<RouteProp<ToDoDetailsParamList>>();
  const { navigate, push } = useNavigation<any>();

  const { id, title } = params ?? {};

  const openEditTodoModal = React.useCallback((id: string) => {
    navigate(Modals.EditDamageReport, { id });
  }, [id, navigate])

  return (
    <Screen scrollable backgroundColor={COLOR.PRIMARY} withSafeArea>
      <PageHeader showBackButton hideGlobalSearch rightButton={
        <Tappable onTap={() => openEditTodoModal(id)}>
          <PencilIcon color={COLOR_X.BLACK} />
        </Tappable>
      }>
        <Stack alignMiddle alignCenter padding={["vertical:small"]} style={{ flexGrow: 1, maxWidth: "80%" }}>
          <Text alignCenter textColor={COLOR_X.SECONDARY} fontSize="large" bold >
            ToDo ID: {id}
          </Text>
        </Stack>
      </PageHeader>
      <Stack fill backgroundColor={COLOR_X.PRIMARY} padding="vertical:x-small">
        <ToDoDetails todoID={id} parentTitle={title}></ToDoDetails>
      </Stack>
    </Screen>
  );
}
