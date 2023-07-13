import React from "react";
import { preventMultiClick } from "./helpers";
import { Screens } from "@immotech/screens";
import { Alert } from "react-native";
import { useQueryClient, QueryClient } from "@tanstack/react-query"
import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { useTranslation } from "react-i18next";


export const navigateToEntityList = (navigation: any) => React.useCallback(
    preventMultiClick(
        () => {
            navigation.navigate(Screens.EntitiesHome);
        }
    ),
    [navigation]
);

export const navigateToPropertyList = (navigation: any) => React.useCallback(
    preventMultiClick(() => {
        navigation.navigate(Screens.PropertiesHome);
    }),
    [navigation]);

export const navigateToUnitList = (navigation: any) => React.useCallback(
    preventMultiClick(() => {
        navigation.navigate(Screens.UnitsHome)
    }), [navigation]);

export const navigateToMaintenanceList = (navigation: any) => React.useCallback(
    preventMultiClick(() => {
        navigation.navigate(Screens.MaintenanceHome)
    }), [navigation]);

export const navigateToToDoList = (navigation: any) => React.useCallback(
    preventMultiClick(() => {
        navigation.navigate(Screens.ToDosHome)
    }), [navigation]);

export const navigateToEntityDetailsScreen = (navigation: any) => React.useCallback(
    preventMultiClick((entityID?: string, internalID?: string, title?: string) => {
        if (!entityID && !internalID) {
            return;
        }
        navigation.navigate(Screens.EntityDetails, { id: entityID, internalID, title });
    }, 2000), [navigation]
);

export const navigateToPropertyDetailsScreen = (navigation: any) => React.useCallback(
    preventMultiClick((propertyID?: string, internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => {
        if (!propertyID && !internalID) {
            return;
        }
        navigation.navigate(Screens.PropertyDetails, { id: propertyID, internalID, object, lat, lon, parentId, title });
    }, 2000), [navigation]
);

export const navigateToUnitDetailsScreen = (navigation: any) => React.useCallback(
    preventMultiClick((unitID?: string, internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => {
        if (!unitID && !internalID) {
            return;
        }
        navigation.navigate(Screens.UnitDetails, { id: unitID, internalID, object, lat, lon, parentId, title });
    }), [navigation]);

export const navigateToMaintenanceDetailsScreen = (navigation: any) => React.useCallback(
    preventMultiClick((maintenanceID?: string, internalID?: string, assignedEntity?: string, type?: string) => {
        if (!maintenanceID && !internalID) {
            return;
        }
        navigation.navigate(Screens.MaintenanceDetails, { id: maintenanceID, internalMaintenanceID: internalID, title: assignedEntity, type });
    }), [navigation]
);

export const navigateToToDoDetailsScreen = (navigation: any) => React.useCallback(
    preventMultiClick((toDoID?: string, title?: string) => {
        if (!toDoID) {
            return;
        }
        navigation.navigate(Screens.ToDoDetails, { id: toDoID, title });
    }), [navigation]
);


export const navigateToProtocolScreen = (navigation: any, queryCache: QueryClient, t: any, internalID?: string, title?: string, object?: "property" | "unit",) => React.useCallback(preventMultiClick((objectID?: string, newProtocol?: boolean) => {
    if (!objectID) return;

    const maintenances = queryCache.getQueryState<MaintenanceListResponse[]>([`maintenancesbyProperty:${objectID}`])?.data || [];
    const maintenancesIDs = maintenances.map((maintenance) => maintenance.nid);

    const isProtocolInCache = maintenancesIDs.some((nid) => queryCache.getQueryState([`protocol:${nid}`]) !== undefined);

    const navigate = () => {
        navigation.navigate(Screens.ProtocolScreen, {
            id: objectID,
            internalID,
            title: title,
            object,
            newProtocol,
        });
    };

    if (isProtocolInCache && newProtocol) {
        Alert.alert(
            `${t("protocol.new_protocol")}`,
            `${t("protocol.new_protocol_confirm")}`,
            [
                { text: `${t("main.cancel")}`, style: "cancel" },
                { text: "OK", onPress: navigate }
            ],
            { cancelable: false }
        );
    } else {
        navigate();
    }

}), [navigation]);