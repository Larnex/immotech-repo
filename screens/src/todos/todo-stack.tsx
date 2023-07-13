import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { Stack } from "native-x-stack";
import React from "react";
import SplashScreen from "react-native-splash-screen";
import { Screens } from "../navigation/screens";
import { ToDoDetailsScreen } from "./todo-details";
import ToDosHome from "./todos-home";

const { Navigator, Screen } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: true,
  ...TransitionPresets.SlideFromRightIOS,
};

export type ToDosStackParamList = {
  [Screens.ToDosHome]: undefined;
};

export function ToDosStack() {
  React.useEffect(() => SplashScreen.hide(), []);
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Stack fill>
      <Navigator screenOptions={screenOptions}>
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
