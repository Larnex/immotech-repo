import { ById } from "@immotech/util";
import { HomeStack } from "../home/home-stack";
import { PropertyStack } from "../properties/property-stack";

export enum Screens {
  Main = "MAIN",
  Login = "LOGIN_SCREEN",
  HomeScreen = "HOME_SCREEN",
  HomeTab = "HOME_TAB",
  ProfileTab = "PROFILE_TAB",
  ProfileScreen = "PROFILE_SCREEN",
  Error = "ERROR",
  Report = "REPORT_SCREEN",
  ElectricityTab = "ELECTRICITY_TAB",
  EntitiesTab = "ENTITIES_TAB",
  EntitiesHome = "ENTITIES_HOME",
  EntityDetails = "ENTITY_DETAILS",
  PropertiesHome = "PROPERTIES_HOME",
  PropertyDetails = "PROPERTY_DETAILS",
  PropertyTab = "PROPERTY_TAB",
  MapScreen = "MAP_SCREEN",
  UnitsHome = "UNITS_HOME",
  UnitDetails = "UNITS_DETAILS",
  ToDoTab = "TODO_TAB",
  ToDosHome = "TODOS_HOME",
  ToDoDetails = "TODOS_DETAILS",
  MaintenanceTab = "MAINTENANCE_TAB",
  MaintenanceHome = "MAINTENANCE_HOME",
  MaintenanceDetails = "MAINTENANCE_DETAILS",
  ProtocolScreen = "PROTOCOL_SCREEN",
  ProtocolList = "PROTOCOL_LIST",
  ProtocolPdfList = "PROTOCOL_PDF_LIST",
  ProtocolPdfView = "PROTOCOL_PDF_VIEW",
  ThreeDView = "THREE_D_VIEW",
}

export type MainStackParamList = {
  [Screens.Login]: undefined;
  [Screens.EntitiesTab]: undefined;
  [Screens.ToDoTab]: undefined;
  [Screens.MaintenanceTab]: undefined;
  [Screens.PropertyTab]: undefined;
};

type ScreenConfigType = {
  screen: (props?: any) => JSX.Element;
  path?: string;
  icon?: (focused: boolean) => JSX.Element;
  initialRouteName?: string;
};

const publicScreens: ById<ScreenConfigType> = {};

const mainScreens: ById<ScreenConfigType> = {
  [Screens.HomeTab]: {
    screen: HomeStack,
    initialRouteName: Screens.HomeScreen,
  },
  [Screens.PropertyTab]: {
    screen: PropertyStack,
    initialRouteName: Screens.PropertiesHome
  }
};

export const appScreens = { publicScreens, mainScreens };
