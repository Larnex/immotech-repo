import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets
} from "@react-navigation/stack";
import { Stack } from "native-x-stack";
import React from "react";
import SplashScreen from "react-native-splash-screen";
import ThreeDScreen from "../3d/three-d-screen";
import { MaintenanceDetailsScreen } from "../maintenance/maintenance-details";
import MaintenanceHome from "../maintenance/maintenance-home";
import Map from "../map/map";
import { Screens } from "../navigation/screens";
import { ProfileScreen } from "../profile/profile-screen";
import { PropertiesHome } from "../properties/properties-home";
import { PropertyDetailsScreen } from "../properties/property-details";
import { ProtocolListScreen } from "../protocol/protocol-list-screen";
import ProtocolPdfScreen from "../protocol/protocol-pdf-screen";
import ProtocolPdfViewScreen from "../protocol/protocol-pdf-view-screen";
import { ProtocolScreen } from "../protocol/protocol-screen";
import { ToDoDetailsScreen } from "../todos/todo-details";
import ToDosHome from "../todos/todos-home";
import { UnitDetailsScreen } from "../unit/unit-details";
import { EntitiesHome } from "./entities-home";
import { EntityDetailsScreen } from "./entity-details";

const { Navigator, Screen } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

export type EntitiesStackParamList = {
  [Screens.EntitiesHome]: undefined;
  [Screens.EntityDetails]: { id: string };
  [Screens.ToDosHome]: undefined;
};

export function EntitiesStack() {
  React.useEffect(() => SplashScreen.hide(), []);
  const tabBarHeight = useBottomTabBarHeight();


  return (
    <Stack fill>
      <Navigator screenOptions={screenOptions}>
        <Screen name={Screens.EntitiesHome} component={EntitiesHome} />
        <Screen name={Screens.ProfileScreen} component={ProfileScreen} />

        <Screen name={Screens.EntityDetails} component={EntityDetailsScreen} />
        <Screen name={Screens.PropertiesHome} component={PropertiesHome} />
        <Screen
          name={Screens.PropertyDetails}
          component={PropertyDetailsScreen}
        ></Screen>
        <Screen name={Screens.MapScreen} component={Map}></Screen>
        <Screen name={Screens.ThreeDView} component={ThreeDScreen} />
        <Screen
          name={Screens.UnitDetails}
          component={UnitDetailsScreen}
        ></Screen>
        <Screen name={Screens.ToDosHome} component={ToDosHome}></Screen>
        <Screen
          name={Screens.ToDoDetails}
          component={ToDoDetailsScreen}
        ></Screen>
        <Screen
          name={Screens.MaintenanceHome}
          component={MaintenanceHome}
        ></Screen>
        <Screen
          name={Screens.MaintenanceDetails}
          component={MaintenanceDetailsScreen}
        ></Screen>

        <Screen
          name={Screens.ProtocolScreen}
          component={ProtocolScreen}
        ></Screen>

        <Screen
          name={Screens.ProtocolList}
          component={ProtocolListScreen}
        ></Screen>

        <Screen
          name={Screens.ProtocolPdfList}
          component={ProtocolPdfScreen}
        ></Screen>

        <Screen
          name={Screens.ProtocolPdfView}
          component={ProtocolPdfViewScreen}
        ></Screen>
      </Navigator>
      <Stack height={tabBarHeight} />
    </Stack>
  );
}
