import { SwitchHeader, SwitchList } from "@immotech-component/list-switch";
import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { ThreeDModels } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { UnitDetails } from "@immotech-feature/unit-details";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import ThreeDScreen from "../3d/three-d-screen";
import MaintenanceHome from "../maintenance/maintenance-home";
import Map from "../map/map";
import { Screens } from "../navigation/screens";
import ToDosHome from "../todos/todos-home";
import { PencilIcon } from "native-x-icon";
import { Tappable } from "native-x-tappable";
import { Modals } from "../navigation/modals";
import { navigateToMaintenanceList, navigateToToDoList } from "@immotech/util";

type UnitDetailsParamList = {
  [Screens.UnitDetails]: { id: string; internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string; title?: string };
};

export function UnitDetailsScreen() {
  const { t } = useTranslation();

  const { setUnitId, setPropertyId, setEntityId, setObject, entityId } = React.useContext(ParentIdContext)

  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<UnitDetailsParamList>>();
  const { id, internalID, object, lat, lon, parentId, title } = params ?? {};
  const [activeHeaderButton, setActiveHeaderButton] = useState('overview');
  const [activeButton, setActiveButton] = useState("maintenance");

  React.useEffect(() => {
    setObject("unit")
  }, []);

  React.useEffect(() => {
    if (id || internalID) {
      setUnitId(id ?? internalID);
    }

    if (parentId) {
      setPropertyId(parentId)
    }
  }, [id])


  const [modelData, setModelData] = useState<ThreeDModels[]>([]);
  const getModelsData = useCallback(
    (data: ThreeDModels[]) => {
      setModelData(data);
    },
    [setModelData]
  );


  const openMap = useCallback(
    (lon: any, lat: any) => {
      navigation.navigate(Screens.MapScreen, { lon, lat });
    },
    [navigation.navigate]
  );

  const navigateToMaintenanceListScreenTap = navigateToMaintenanceList(navigation);

  const navigateToToDoListScreenTap = navigateToToDoList(navigation);

  const openEditUnitModal = useCallback((id: string) => {
    navigation.navigate(Modals.EditUnit, { id });
  }, [id, navigation.navigate])

  return (
    <Screen backgroundColor={COLOR.PRIMARY} withSafeArea>


      <PageHeader
        showBackButton
        accentColor={COLOR_X.SECONDARY}
        hideGlobalSearch
        rightButton={
          <Tappable onTap={() => openEditUnitModal(id)}>
            <PencilIcon color={COLOR_X.BLACK} />
          </Tappable>
        }
      >
        <Stack alignMiddle alignCenter padding={["vertical:small"]} style={{ flexGrow: 1, maxWidth: "80%" }}>
          <Text alignCenter textColor={COLOR_X.SECONDARY} fontSize="large" bold>
            {t("main.utilization_unit")}: {title}
          </Text>
        </Stack>
      </PageHeader>


      <SwitchHeader activeHeaderButton={activeHeaderButton} setActiveHeaderButton={setActiveHeaderButton} no3dModels={modelData.length === 0} />

      {activeHeaderButton === 'overview' && (

        <Stack fill backgroundColor={COLOR_X.PRIMARY} padding="vertical:x-small">
          <UnitDetails
            unitId={id}
            onOpenMap={openMap}
            onMaintenanceListTap={navigateToMaintenanceListScreenTap}
            onToDoListTap={navigateToToDoListScreenTap}
            getModels={getModelsData}
            internalID={internalID!}
          />
          <SwitchList activeButton={activeButton} setActiveButton={setActiveButton} object='unit' />
          {activeButton === 'maintenance' && (
            <MaintenanceHome />
          )}

          {activeButton === 'todos' && (
            <ToDosHome />
          )}
        </Stack>
      )}

      {activeHeaderButton === 'map' && (
        <Map />
      )}

      {activeHeaderButton === '3d-model' && (
        <ThreeDScreen modelsProp={modelData} parentIdProp={parentId} objectProp="unit" />
      )}
    </Screen>
  );
}
