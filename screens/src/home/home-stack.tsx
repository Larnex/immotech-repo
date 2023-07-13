import {
    createStackNavigator,
    StackNavigationOptions
} from "@react-navigation/stack";
import { Stack } from "native-x-stack";
import React from "react";
import { AppHeader } from "../../../feature/app-header/src/app-header";
import ThreeDScreen from "../3d/three-d-screen";
import { EntitiesHome } from "../entities/entities-home";
import { EntityDetailsScreen } from "../entities/entity-details";
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
import UnitsHome from "../unit/units-home";
import { HomeScreen } from "./home-screen";


const { Navigator, Screen } = createStackNavigator();

const screenOptions: StackNavigationOptions = {
    headerShown: true,
    header: () => <AppHeader />
    // animationEnabled: true,
    // ...TransitionPresets.SlideFromRightIOS,
};

export function HomeStack() {
    // React.useEffect(() => SplashScreen.hide(), []);
    // const tabBarHeight = useBottomTabBarHeight();


    return (
        <Stack fill>
            <Navigator screenOptions={screenOptions} initialRouteName={Screens.HomeScreen}>
                <Screen name={Screens.HomeScreen} component={HomeScreen} />
                <Screen name={Screens.EntitiesHome} component={EntitiesHome} />
                <Screen name={Screens.PropertiesHome} component={PropertiesHome} />
                <Screen name={Screens.EntityDetails} component={EntityDetailsScreen} />
                <Screen name={Screens.PropertyDetails} component={PropertyDetailsScreen} />
                <Screen name={Screens.UnitsHome} component={UnitsHome} />
                <Screen name={Screens.MaintenanceHome} component={MaintenanceHome} />
                <Screen name={Screens.ToDosHome} component={ToDosHome} />
                <Screen name={Screens.ProtocolPdfList} component={ProtocolPdfScreen} />
                <Screen name={Screens.MapScreen} component={Map} />
                <Screen name={Screens.UnitDetails} component={UnitDetailsScreen} />
                <Screen name={Screens.MaintenanceDetails} component={MaintenanceDetailsScreen} />
                <Screen name={Screens.ToDoDetails} component={ToDoDetailsScreen} />
                <Screen name={Screens.ProtocolScreen} component={ProtocolScreen} />
                <Screen
                    name={Screens.ProtocolPdfView}
                    component={ProtocolPdfViewScreen}
                />
                <Screen
                    name={Screens.ProtocolList}
                    component={ProtocolListScreen}
                />
                <Screen name={Screens.ThreeDView} component={ThreeDScreen} />
                <Screen name={Screens.ProfileScreen} component={ProfileScreen}></Screen>

            </Navigator>
            {/* <Stack height={tabBarHeight} /> */}
        </Stack>
    );
}
