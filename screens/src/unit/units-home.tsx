import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { UnitList } from "@immotech-feature/unit-list";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { t } from "i18next";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import { navigateToUnitDetailsScreen } from "@immotech/util";


type UnitParamList = {
  [Screens.UnitsHome]: { id: string, internalID?: string };
};

export function UnitsHomeComponent() {
  const navigation = useNavigation<any>();

  const { params } = useRoute<RouteProp<UnitParamList>>();
  const { id, internalID } = params ?? {};

  const navigateToUnitDetailsScreenTap = navigateToUnitDetailsScreen(navigation)


  const openAddDamageModal = React.useCallback(() => {
    navigation.navigate(Modals.DamageReport, { id });
  }, [id, navigation.navigate]);

  const openAddMaintenanceModal = React.useCallback(() => {
    navigation.navigate(Modals.AddMaintenance, { id });
  }, [id, navigation.navigate]);

  const openAddUnitModal = React.useCallback(() => {
    navigation.navigate(Modals.AddUnit, { id, internalID: params?.internalID });
  }, [id, navigation.navigate]);

  const openEditUnitModal = React.useCallback(
    (id: string) => {
      navigation.navigate(Modals.EditUnit, { id });
    },
    [id, navigation.navigate]
  );

  return (
    <Screen withSafeArea>
      <Stack alignCenter fill backgroundColor={COLOR_X.PRIMARY}>
        {(!id && !internalID) && (
          <Stack horizontal fillHorizontal alignCenter justifyBetween>

            <PageHeader showBackButton={!id} backButtonColor={COLOR_X.BLACK} hideGlobalSearch>
              <Stack>
                <Text
                  semiBold
                  alignCenter
                  fontSize="large"
                  textColor={COLOR_X.BLACK}
                >
                  {t("main.utilization_units")}
                </Text>
              </Stack>
            </PageHeader>
          </Stack>
        )}

        <UnitList
          propertyId={id}
          onSelectUnit={navigateToUnitDetailsScreenTap}
          internalNumber={params?.internalID}
          onAddUnitTap={openAddUnitModal}
          onEditUnitTap={openEditUnitModal}
          onAddDamageTap={openAddDamageModal}
          onAddMaintenanceTap={openAddMaintenanceModal}
        />
      </Stack>
    </Screen >
  );
}

const UnitsHome = React.memo(UnitsHomeComponent);

export default UnitsHome;
