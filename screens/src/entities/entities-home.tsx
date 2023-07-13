import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { EntitiesList } from "@immotech-feature/entity-list";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { Text } from "@immotech-component/text";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import { COLOR } from "native-x-theme";
import { useTranslation } from "react-i18next";
import { navigateToEntityDetailsScreen } from "@immotech/util";

type EntitiesParamList = {
  [Screens.EntitiesHome]: {
    id?: string;
    internalNumber?: string;
    name?: string;
    city?: string;
    zipCode?: string;

    byNumber?: boolean;
    byName?: boolean;
    byZip?: boolean;
    byCity?: boolean;
  };
};

export function EntitiesHome() {

  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const { params } = useRoute<RouteProp<EntitiesParamList>>();


  const {
    id,
    name,
    internalNumber,
    city,
    zipCode,
    byNumber,
    byName,
    byZip,
    byCity,
  } = params ?? {};

  const navigateToEntityDetailsScreenTap = navigateToEntityDetailsScreen(navigation);

  const openAddEntityModal = React.useCallback(() => {
    navigation.navigate(Modals.AddEntity);
  }, [navigation.navigate]);

  const openEditEntityModal = React.useCallback(
    (id: string) => {
      navigation.navigate(Modals.EditEntity, { id });
    },
    [navigation.navigate]
  );

  const navigateToSearch = () => {
    navigation.navigate(Modals.Search, {
      target: Screens.EntitiesHome,
      name,
      internalNumber,
      city,
      zipCode,
    });
  };

  const navigateToSort = () => {
    navigation.navigate(Modals.Sort, {
      target: Screens.EntitiesHome,
      byNumber,
      byName,
      byZip,
      byCity,
    });
  };

  const clearSearchParams = () => {
    navigation.navigate(Screens.EntitiesHome);
  };

  return (
    <Screen withSafeArea>
      <Stack alignCenter fill>


        <Stack horizontal fillHorizontal alignCenter justifyBetween>

          <PageHeader showBackButton backButtonColor={COLOR_X.BLACK} hideGlobalSearch>
            <Stack alignRight>
              <Text
                semiBold
                alignCenter
                fontSize="large"
                textColor={COLOR_X.BLACK}
              >
                {t("main.entities")}
              </Text>
            </Stack>
          </PageHeader>
        </Stack>

        <EntitiesList
          onEntitySelect={navigateToEntityDetailsScreenTap}
          onAddEntityTap={openAddEntityModal}
          onEditEntityTap={openEditEntityModal}
          name={name}
          internalNumber={internalNumber}
          city={city}
          zipCode={zipCode}
          onSearchIconTap={navigateToSearch}
          onSortIconTap={navigateToSort}
          onClearSearchTap={clearSearchParams}
          byNumber={byNumber}
          byName={byName}
          byZip={byZip}
          byCity={byCity}
        />
      </Stack>
    </Screen>
  );
}
