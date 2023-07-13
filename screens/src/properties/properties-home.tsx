import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { PropertiesList } from "@immotech-feature/property-list";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import { navigateToPropertyDetailsScreen } from "@immotech/util";

type PropertyParamList = {
  [Screens.PropertiesHome]: {
    id?: string;
    nid?: string;
    internalNumber?: string;
    internalID?: string;
    name?: string;
    city?: string;
    zipCode?: string;

    byNumber?: boolean;
    byName?: boolean;
    byZip?: boolean;
    byCity?: boolean;


  };
};

function PropertiesHomeComponent() {

  const navigation = useNavigation<any>();

  const { params } = useRoute<RouteProp<PropertyParamList>>();

  const {
    id,
    name,
    nid,
    internalNumber,
    internalID,
    city,
    zipCode,
    byNumber,
    byName,
    byCity,
    byZip,
  } = params ?? {};




  const navigateToSearch = () => {
    navigation.navigate(Modals.Search, {
      target: Screens.PropertiesHome,
      name,
      nid,
      internalNumber,
      city,
      zipCode,
    });
  };

  const clearSearchParams = () => {
    navigation.navigate(Screens.PropertiesHome);
  };

  const navigateToPropertyDetailsScreenTap = navigateToPropertyDetailsScreen(navigation);

  const openAddPropertyModal = React.useCallback(() => {
    navigation.navigate(Modals.AddProperty, { id, internalID });
  }, [id, navigation.navigate]);

  const openEditPropertyModal = React.useCallback(
    (id: string) => {
      navigation.navigate(Modals.EditProperty, { id });
    },
    [id, navigation.navigate]
  );
  const navigateToSort = () => {
    navigation.navigate(Modals.Sort, {
      target: Screens.PropertiesHome,
      byNumber,
      byName,
      byZip,
      byCity,
    });
  };

  return (
    <Screen withSafeArea >
      <Stack alignCenter fill backgroundColor={COLOR_X.PRIMARY}>
        <Stack horizontal fillHorizontal alignCenter justifyBetween>
          {!internalID && (
            <PageHeader showBackButton={!internalID} backButtonColor={COLOR_X.BLACK} hideGlobalSearch>
              <Stack>
                <Text
                  semiBold
                  alignCenter
                  fontSize="large"
                  textColor={COLOR_X.BLACK}
                >
                  {t("main.properties")}
                </Text>
              </Stack>
            </PageHeader>
          )}
        </Stack>


        <PropertiesList
          filterHeaderActive={true}
          name={name}
          nid={nid}
          internalNumber={nid}
          internalID={internalID}
          city={city}
          zipCode={zipCode}
          entityId={id}
          onSearchIconTap={navigateToSearch}
          onClearSearchTap={clearSearchParams}
          onPropertySelect={navigateToPropertyDetailsScreenTap}
          onAddPropertyTap={openAddPropertyModal}
          onEditPropertyTap={openEditPropertyModal}
          onSortIconTap={navigateToSort}
          byNumber={byNumber}
          byName={byName}
          byZip={byZip}
          byCity={byCity}
        />
      </Stack>
    </Screen>
  );
}

export const PropertiesHome = React.memo(PropertiesHomeComponent);
