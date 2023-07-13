import { AppHeader } from "@immotech-feature/app-header";
import {
  NavigationContainer,
  NavigatorScreenParams
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions
} from "@react-navigation/stack";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { MainStack } from "./main-stack";
import { ModalParamList, Modals, modals } from "./modals";
import { MainStackParamList, Screens } from "./screens";
import { HomeStack } from "../home/home-stack";

export type RootStackParamList = {
  [Screens.Main]: NavigatorScreenParams<MainStackParamList>;
} & ModalParamList;

const { Navigator, Screen, Group } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "transparent" },
  cardOverlayEnabled: false,
  // animationEnabled: false,
  presentation: "transparentModal",
};

export function RootStack() {

  const modalScreens = React.useMemo(
    () =>
      Object.keys(modals).map((name: any) => {
        return (
          <Screen key={name} name={name} component={modals[name].screen} />
        );
      }),
    []
  );

  return (
    <NavigationContainer onUnhandledAction={() => {
      console.warn("unhandled action in root stack");
    }}>
      <Navigator>
        <Group screenOptions={screenOptions}>
          <Screen name={Screens.Main} component={MainStack} />
          {modalScreens}
        </Group>
      </Navigator>
    </NavigationContainer>
  );
}
