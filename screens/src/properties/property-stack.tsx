import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets
} from "@react-navigation/stack";
import { Stack } from "native-x-stack";
import React from "react";
import SplashScreen from "react-native-splash-screen";
import { MaintenanceDetailsScreen } from "../maintenance/maintenance-details";
import MaintenanceHome from "../maintenance/maintenance-home";
import { Screens } from "../navigation/screens";
import { ProtocolListScreen } from "../protocol/protocol-list-screen";
import ProtocolPdfScreen from "../protocol/protocol-pdf-screen";
import ProtocolPdfViewScreen from "../protocol/protocol-pdf-view-screen";
import { ProtocolScreen } from "../protocol/protocol-screen";
import { ToDoDetailsScreen } from "../todos/todo-details";
import ToDosHome from "../todos/todos-home";
import { UnitDetailsScreen } from "../unit/unit-details";
import UnitsHome from "../unit/units-home";
import { PropertiesHome } from "./properties-home";
import { PropertyDetailsScreen } from "./property-details";

const { Navigator, Screen } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

export type PropertyStackParamList = {
  [Screens.PropertiesHome]: { entityId?: string };
};

export function PropertyStack() {
  React.useEffect(() => SplashScreen.hide(), []);
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Stack fill>
      <Navigator screenOptions={screenOptions}>
        <Screen
          name={Screens.PropertiesHome}
          component={PropertiesHome}
        ></Screen>
        <Screen
          name={Screens.PropertyDetails}
          component={PropertyDetailsScreen}
        ></Screen>
        <Screen name={Screens.ToDosHome} component={ToDosHome}></Screen>
        <Screen
          name={Screens.ToDoDetails}
          component={ToDoDetailsScreen}
        ></Screen>
        <Screen name={Screens.UnitsHome} component={UnitsHome}></Screen>
        <Screen
          name={Screens.UnitDetails}
          component={UnitDetailsScreen}
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
