import { SwitchHeader, SwitchList } from "@immotech-component/list-switch";
import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { ThreeDModels } from "@immotech-feature/property-api";
import { PropertyDetails } from "@immotech-feature/property-details";
import { COLOR_X } from "@immotech-feature/theme";
import { navigateToMaintenanceDetailsScreen, navigateToProtocolScreen, navigateToToDoDetailsScreen, navigateToUnitDetailsScreen } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { PencilIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MaintenanceList } from "../../../feature/maintenance-list/src/maintenance-list";
import { ToDoList } from "../../../feature/todo-list/src/todos-list";
import { UnitList } from "../../../feature/unit-list/src/unit-list";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import ThreeDScreen from "../3d/three-d-screen";
import Map from "../map/map";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";
import ProtocolPdfScreen from "../protocol/protocol-pdf-screen";
import { useQueryClient } from "@tanstack/react-query";



type PropertyDetailsParamList = {
  [Screens.PropertyDetails]: { id: string; internalID?: string, object?: "property" | "unit", lat?: string, lon?: string; parentId?: string, title?: string };
};

function PropertyDetailsScreenComponent() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<PropertyDetailsParamList>>();
  const queryCache = useQueryClient();
  const [modelData, setModelData] = useState<ThreeDModels[]>([]);
  const { id, internalID, object, lat, lon, parentId, title } = params ?? {};
  const [activeHeaderButton, setActiveHeaderButton] = React.useState('overview');
  const [activeButton, setActiveButton] = React.useState("units");

  const { setPropertyId, setEntityId, setObject, setUnitId } = React.useContext(ParentIdContext);

  React.useEffect(() => {
    if (parentId) {
      setEntityId(parentId);
    }

    if (id || internalID) {
      setPropertyId(!!id ? id : internalID as any);
      setUnitId(null);
    }
  }, [parentId, id, internalID]);

  React.useEffect(() => {
    setObject("property");
  }, [])


  const getModelsData = useCallback(
    (data: ThreeDModels[]) => {
      setModelData(data);
    },
    [setModelData]
  );

  const navigateToToDoListScreen = useCallback(
    (internalID: string, propertyID?: string, title?: string) => {
      if (!propertyID && !internalID) {
        return;
      }

      navigation.navigate(Screens.ToDosHome, { id: propertyID, internalID: internalID, title });
    },
    [navigation.navigate]
  );

  const navigateToMaintenanceListScreen = useCallback(
    (internalID: string, propertyID?: string, title?: string) => {
      if (!propertyID && !internalID) {
        return;
      }

      navigation.navigate(Screens.MaintenanceHome, {
        id: propertyID,
        internalID: internalID,
        title,
        object: "property",
      });
    },
    [navigation.navigate]
  );

  const navigateToUnitDetailsScreenTap = navigateToUnitDetailsScreen(navigation);
  const navigateToMaintenanceDetailsScreenTap = navigateToMaintenanceDetailsScreen(navigation);
  const navigateToToDoDetailsScreenTap = navigateToToDoDetailsScreen(navigation);

  const navigateToProtocolScreenTap = navigateToProtocolScreen(navigation,
    queryCache, t, internalID, title, "property");

  const openMap = useCallback(
    (lon: any, lat: any) => {
      navigation.navigate(Screens.MapScreen, { lon, lat });
    },
    [navigation.navigate]
  );

  const openEditPropertyModal = useCallback((id: string) => {
    navigation.navigate(Modals.EditProperty, { id })
  }, [id, navigation.navigate])

  const renderSwitchList = useCallback((activeButton: string) => {
    switch (activeButton) {
      case "units":
        return <UnitList propertyId={id} onSelectUnit={navigateToUnitDetailsScreenTap} internalNumber={internalID} />;
      case "maintenance":
        return <MaintenanceList onAddProtocolTap={navigateToProtocolScreenTap} onMaintenanceSelect={navigateToMaintenanceDetailsScreenTap} id={id} object="property" internalID={internalID} />;
      case "todos":
        return <ToDoList onToDoSelect={navigateToToDoDetailsScreenTap} parentId={id} internalID={internalID} />;
      case "protocols":
        return <ProtocolPdfScreen />;
      default:
        return null;
    }
  }, []);

  return (
    <Screen withSafeArea backgroundColor={COLOR.PRIMARY}>
      <PageHeader
        showBackButton
        accentColor={COLOR_X.SECONDARY}
        hideGlobalSearch
        rightButton={
          <Tappable onTap={() => openEditPropertyModal(id)}>
            <PencilIcon color={COLOR_X.BLACK} />
          </Tappable>
        }
      >
        <Stack alignMiddle alignCenter padding={["vertical:small"]} style={{ flexGrow: 1, maxWidth: "80%" }}>
          <Text alignCenter textColor={COLOR_X.SECONDARY} fontSize="large" bold>{t("main.property")}: {title}</Text>
        </Stack>
      </PageHeader>
      <Stack fill>
        <SwitchHeader activeHeaderButton={activeHeaderButton} setActiveHeaderButton={setActiveHeaderButton} no3dModels={modelData.length === 0} />

        {(activeHeaderButton === 'overview' || activeHeaderButton === 'info') && (

          <>
            <PropertyDetails
              propertyId={id}
              onOpenMap={openMap}
              onToDoListTap={navigateToToDoListScreen}
              onMaintenanceListTap={navigateToMaintenanceListScreen}
              getModels={getModelsData}
              internalID={internalID}
              showFullInfo={activeHeaderButton === 'info'}
            />


            {activeHeaderButton === 'overview' && (<>
              <SwitchList activeButton={activeButton} setActiveButton={setActiveButton} object='property' />
              {renderSwitchList(activeButton)}
            </>
            )}

          </>
        )}

        {activeHeaderButton === 'map' && (
          <Map />
        )}

        {activeHeaderButton === '3d-model' && (
          <ThreeDScreen modelsProp={modelData} parentIdProp={parentId} objectProp="property" />
        )}

      </Stack>
    </Screen>
  );
}

export const PropertyDetailsScreen = React.memo(PropertyDetailsScreenComponent);