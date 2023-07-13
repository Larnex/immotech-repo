import { AppHeader } from "@immotech-feature/app-header";
import { AuthState, useAuth } from "@immotech-feature/auth";
import { NavBar } from "@immotech-feature/nav-bar";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from "@react-navigation/bottom-tabs";
import { Stack } from "native-x-stack";
import React from "react";
import {
  createStackNavigator,
  StackNavigationOptions
} from "@react-navigation/stack";

import { useNavigationState } from "@react-navigation/native";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { LoginScreen } from "../login/login-screen";
import { appScreens, MainStackParamList, Screens } from "./screens";

const { mainScreens, publicScreens } = appScreens;

const { Navigator, Screen, Group } =
  createBottomTabNavigator();

const navigatorOptions: BottomTabNavigationOptions = {};

export const MainStack = () => {
  const { state } = useAuth();

  const navState = useNavigationState((state) => {
    return state
  });

  const [entityId, setEntityId] = React.useState<string | null>(null);
  const [propertyId, setPropertyId] = React.useState<string | null>(null);
  const [unitId, setUnitId] = React.useState<string | null>(null);
  const [maintenanceId, setMaintenanceId] = React.useState<string | null>(null);
  const [object, setObject] = React.useState<'property' | 'unit' | null>(null);

  const contextValue = React.useMemo(() => ({
    entityId,
    setEntityId,
    propertyId,
    setPropertyId,
    unitId,
    setUnitId,
    maintenanceId,
    setMaintenanceId,
    object,
    setObject,
  }), [entityId, propertyId, unitId, maintenanceId, object]);


  const renderHeader = React.useCallback(() => <AppHeader />, []);

  const publicScreenOptions: any = React.useMemo(
    () => ({ tabBarStyle: { display: "none" }, headerShown: false }),
    []
  );

  const mainScreenOptions: any = React.useMemo(
    () => ({ header: renderHeader }),
    [renderHeader]
  );


  const publicNavigatorScreens = React.useMemo(
    () =>
      Object.keys(publicScreens).map((screen) => {
        return (
          <Screen
            key={screen}
            name={screen as any}
            component={publicScreens[screen].screen}
          />
        );
      }),
    []
  );

  const mainMenuNavigatorScreens = React.useMemo(
    () =>
      Object.keys(mainScreens).map((screen) => {
        return (
          <Screen
            key={screen}
            name={screen as any}
            component={mainScreens[screen].screen}
          />
        );
      }),
    []
  );

  if (state !== AuthState.AUTHORIZED) {
    // How to fix navigator cannot be used as a JSX component
    return (
      <Navigator
        // tabBar={(props) => <NavBar {...props} navState={navState} />}
        initialRouteName={Screens.Login}
        screenOptions={publicScreenOptions}
        backBehavior="history"
      >
        <Screen name={Screens.Login} component={LoginScreen} />
        <Group>{publicNavigatorScreens}</Group>
      </Navigator>
    );
  }

  return (
    <Stack fill>
      <ParentIdContext.Provider value={contextValue}>
        <Navigator
          tabBar={(props) => <NavBar {...props} navState={navState} />}
          initialRouteName={Screens.HomeScreen}
          screenOptions={navigatorOptions}
          backBehavior="history"
        >
          <Group screenOptions={mainScreenOptions}>
            {mainMenuNavigatorScreens}
          </Group>

          <Group screenOptions={publicScreenOptions}>
            {publicNavigatorScreens}
          </Group>
        </Navigator>
      </ParentIdContext.Provider>
    </Stack>
  );
}
