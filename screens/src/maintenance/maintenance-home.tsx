import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { MaintenanceList } from "@immotech-feature/maintenance-list";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { MaintenanceListResponse } from "../../../feature/maintenance-api/src/use-maintenance";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import { Alert } from 'react-native';
import { navigateToMaintenanceDetailsScreen, navigateToProtocolScreen } from "@immotech/util";

type MaintenanceParamList = {
  [Screens.MaintenanceHome]: {
    id: string;
    title?: string;
    internalID?: string;
    object?: "property" | "unit";
    type?: string;
    name?: string;
    manufacturer?: string;
    byMaintenanceName?: boolean;
    byType?: boolean;
    byDateStart?: boolean;
    byDateEnd?: boolean;
    parentName?: string
  };
};

export default function MaintenanceHome() {

  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const queryCache = useQueryClient();


  const { params } = useRoute<RouteProp<MaintenanceParamList>>();
  const {
    id,
    title,
    internalID,
    name,
    manufacturer,
    parentName,
    type,
    object,
    byMaintenanceName,
    byType,
    byDateStart,
    byDateEnd,
  } = params ?? {};
  const navigateToSearch = () => {
    navigation.navigate(Modals.Search, {
      target: Screens.MaintenanceHome,
      name,
      manufacturer,
      parentName
    })
  }

  const clearSearchParams = () => {
    navigation.navigate(Screens.MaintenanceHome);
  };

  const navigateToFilters = () => {
    navigation.navigate(Modals.Filters, {
      target: Screens.MaintenanceHome,
      type,
    });
  };

  const openEditMaintenanceModal = React.useCallback(
    (id: string) => {
      navigation.navigate(Modals.EditMaintenance, { id });
    },
    [id, navigation.navigate]
  );

  const navigateToProtocolScreenTap = navigateToProtocolScreen(navigation, queryCache, t, internalID, title, object)


  const navigateToProtocolsPdfScreen = React.useCallback(
    (objectID?: string) => {
      if (!objectID) return;

      navigation.navigate(Screens.ProtocolPdfList, { id: objectID, internalID, title, object });
    },
    [navigation.navigate]
  );

  const navigateToMaintenanceDetailsScreenTap = navigateToMaintenanceDetailsScreen(navigation);

  const openAddMaintenanceModal = React.useCallback(() => {
    navigation.navigate(Modals.AddMaintenance, { id, internalID: internalID, object: object });
  }, [id, navigation.navigate]);

  const navigateToSortModal = () => {
    navigation.navigate(Modals.Sort, {
      target: Screens.MaintenanceHome,
      byMaintenanceName,
      byType,
      byDateStart,
      byDateEnd,
    });
  };

  return (
    <Screen withSafeArea>
      <Stack alignCenter fill backgroundColor={COLOR_X.PRIMARY}>
        {(!id && !internalID) && (
          <Stack horizontal fillHorizontal alignCenter justifyBetween>

            <PageHeader
              showBackButton={!id}
              hideGlobalSearch
            ><Stack>
                <Text
                  semiBold
                  fontSize="large"
                  textColor={COLOR_X.BLACK}
                  alignCenter
                >
                  {!!id
                    ? `${t("main.maintenance")} of ${title} (ID: ${internalID})`
                    : `${t("main.maintenance_list")}`}
                </Text>
              </Stack>
            </PageHeader>
          </Stack>
        )}
        <MaintenanceList
          type={type}
          filterHeaderActive={true}
          id={id}
          internalID={internalID}
          onMaintenanceSelect={navigateToMaintenanceDetailsScreenTap}
          onFilterIconTap={navigateToFilters}
          name={name}
          manufacturer={manufacturer}
          parentName={parentName}
          onSearchIconTap={navigateToSearch}
          onClearSearchTap={clearSearchParams}
          onEditMaintenanceTap={openEditMaintenanceModal}
          onAddProtocolTap={navigateToProtocolScreenTap}
          onOpenProtocolsPdfTap={navigateToProtocolsPdfScreen}
          onAddMaintenanceTap={openAddMaintenanceModal}
          onSortIconTap={navigateToSortModal}
          byMaintenanceName={byMaintenanceName}
          byType={byType}
          byDateStart={byDateStart}
          byDateEnd={byDateEnd}
          object={object}
        />
      </Stack>

    </Screen>
  );
}

