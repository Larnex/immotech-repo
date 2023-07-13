import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoList } from "@immotech-feature/todo-list";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import { Spacer } from "native-x-spacer";
import { navigateToToDoDetailsScreen } from "@immotech/util";

type ToDoParamList = {
  [Screens.ToDosHome]: {
    id?: string;
    title?: string;
    nid?: string;
    propertyID?: string;
    unitID?: string;
    // cost?: string;
    shortDescription?: string;
    longDescription?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    urgency?: string;
    internalID?: string;
    maintenance?: boolean;
    byToDoName?: boolean;
    byCostHigh?: boolean;
    byCostLow?: boolean;
    byUrgency?: boolean;
    byStatus?: boolean;
    parentName?: string;
    navigateFromProtocol?: boolean;
  };
};

export default function ToDosHome() {
  const [fromDate, setFromDate] = React.useState<any>();

  const [toDate, setToDate] = React.useState<any>();

  const navigation = useNavigation<any>();

  const { params } = useRoute<RouteProp<ToDoParamList>>();
  const {
    id,
    title,
    nid,
    propertyID,
    unitID,
    shortDescription,
    longDescription,
    startDate,
    endDate,
    status,
    urgency,
    internalID,
    maintenance,
    byToDoName,
    byCostHigh,
    byCostLow,
    byUrgency,
    byStatus,
    parentName,
    navigateFromProtocol
  } = params ?? {};
  const navigateToSearch = () => {
    navigation.navigate(Modals.Search, { target: Screens.ToDosHome, parentName });
  };

  const clearSearchParams = () => {
    navigation.navigate(Screens.ToDosHome);
  };

  const openEditToDoModal = React.useCallback(
    (id: string) => {
      navigation.navigate(Modals.EditDamageReport, { id });
    },
    [id, navigation.navigate]
  );

  const navigateToFilters = () => {
    navigation.navigate(Modals.Filters, {
      target: Screens.ToDosHome,
      status,
      urgency,
      startDate,
      endDate,
    });
  };

  const navigateToToDoDetailsScreenTap = navigateToToDoDetailsScreen(navigation);

  React.useEffect(() => {
    if (startDate) {
      setFromDate(Math.floor(new Date(startDate).getTime() / 1000).toString());
    }
  }, [startDate]);

  React.useEffect(() => {
    if (endDate) {
      setToDate(Math.floor(new Date(endDate).getTime() / 1000).toString());
    }
  }, [endDate]);

  const openAddTodoModal = React.useCallback(() => {
    navigation.navigate(Modals.DamageReport, { id, unitId: unitID, maintenance });
  }, [id, maintenance, navigation.navigate]);

  const navigateToSort = () => {
    navigation.navigate(Modals.Sort, {
      target: Screens.ToDosHome,
      byToDoName,
      byCostHigh,
      byCostLow,
      byUrgency,
      byStatus,
    });
  };

  return (
    <Screen withSafeArea>
      <Stack alignCenter fill backgroundColor={COLOR_X.PRIMARY}>

        {((!id && !internalID) || navigateFromProtocol) && (
          <Stack horizontal fillHorizontal alignCenter justifyBetween>
            <PageHeader showBackButton={!id || navigateFromProtocol} hideGlobalSearch accentColor={COLOR_X.TO_DO_HEADER}>
              <Stack alignCenter paddingHorizontal={10}>
                <Text
                  semiBold
                  alignCenter
                  fontSize="large"
                  textColor={COLOR_X.BLACK}
                >
                  {id
                    ? `ToDo's of ${title ? title : ''}(ID: ${internalID ?? id})`

                    : "ToDo's List"}
                </Text>
              </Stack>
            </PageHeader>
          </Stack>
        )}
        <ToDoList
          filterHeaderActive={!id}
          parentId={id}
          internalID={internalID!}
          onToDoSelect={navigateToToDoDetailsScreenTap}
          onSearchIconTap={navigateToSearch}
          shortDescription={shortDescription}
          longDescription={longDescription}
          onFilterIconTap={navigateToFilters}
          onClearSearchTap={clearSearchParams}
          onEditToDoTap={openEditToDoModal}
          onAddToDoTap={openAddTodoModal}
          // cost={cost}
          parentName={parentName}
          urgency={urgency}
          status={status}
          nid={nid}
          to={toDate}
          from={fromDate}
          byToDoName={byToDoName}
          byCostHigh={byCostHigh}
          byCostLow={byCostLow}
          byUrgency={byUrgency}
          byStatus={byStatus}
          onSortIconTap={navigateToSort}
          navigateFromProtocol={navigateFromProtocol}
        />
      </Stack>
    </Screen>
  );
}
