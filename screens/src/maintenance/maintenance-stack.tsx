import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets
} from "@react-navigation/stack";
import { Stack } from "native-x-stack";
import React from "react";
import SplashScreen from "react-native-splash-screen";
import { Screens } from "../navigation/screens";
import { ToDoDetailsScreen } from "../todos/todo-details";
import ToDosHome from "../todos/todos-home";
import { MaintenanceDetailsScreen } from "./maintenance-details";
import MaintenanceHome from "./maintenance-home";

const { Navigator, Screen } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

export type MaintenanceStackParamList = {
  [Screens.MaintenanceHome]: undefined;
};

export function MaintenanceStack() {
  React.useEffect(() => SplashScreen.hide(), []);
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Stack fill>
      <Navigator screenOptions={screenOptions}>
        <Screen
          name={Screens.MaintenanceHome}
          component={MaintenanceHome}
        ></Screen>
        <Screen
          name={Screens.MaintenanceDetails}
          component={MaintenanceDetailsScreen}
        ></Screen>
        <Screen name={Screens.ToDosHome} component={ToDosHome}></Screen>
        <Screen
          name={Screens.ToDoDetails}
          component={ToDoDetailsScreen}
        ></Screen>
      </Navigator>
      <Stack height={tabBarHeight} />
    </Stack>
  );
}
