import { Screen } from "@immotech-component/screen";
import { useAuth } from "@immotech-feature/auth";
import { navigateToEntityDetailsScreen, navigateToEntityList, navigateToMaintenanceDetailsScreen, navigateToMaintenanceList, navigateToPropertyDetailsScreen, navigateToPropertyList, navigateToToDoDetailsScreen, navigateToToDoList, navigateToUnitDetailsScreen, navigateToUnitList } from "@immotech/util";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { GlobalSearch } from "../../../component/global-search/src";
import { NavigationSwipe } from "../../../component/navigation/src";
import { Backup } from "../../../feature/backup/src/backup";
import { NearbyObjects } from "../../../feature/nearby-objects/src";
import ParentIdContext, { ParentIdContextValue } from "../../../src/contexts/parent-id-context";


const HomeScreenContent = React.memo(() => {


    const navigation = useNavigation<any>();

    // const { setPropertyId, setEntityId, setUnitId, setMaintenanceId } = React.useContext<ParentIdContextValue>(ParentIdContext);


    // State to hold the backup status
    const [backupStatus, setBackupStatus] = React.useState<string | null>(null);

    // Retrieve backup status from AsyncStorage
    React.useEffect(() => {
        console.log("HomeScreenContent rendered");
        const fetchBackupStatus = async () => {
            const status = await AsyncStorage.getItem('backupStatus');
            setBackupStatus(status);
        };

        fetchBackupStatus();

        return () => {
            console.log("HomeScreenContent unmounted");
        }
    }, []);


    // useFocusEffect(
    //     React.useCallback(() => {
    //         console.log("HomeScreenContent focus effect triggered");

    //         let isMounted = true;

    //         if (isMounted) {
    //             setEntityId(null);
    //             setPropertyId(null);
    //             setUnitId(null);
    //             setMaintenanceId(null);
    //         }

    //         return () => {
    //             isMounted = false;
    //         }
    //     }, [])
    // );

    const navigateToEntityListTap = navigateToEntityList(navigation)
    // const navigateToPropertyListTap = navigateToPropertyList(navigation);

    const navigateToPropertyListTap = navigateToPropertyList(navigation);

    const navigateToUnitListTap = navigateToUnitList(navigation);
    const navigateToMaintenanceListTap = navigateToMaintenanceList(navigation);
    const navigateToToDoListTap = navigateToToDoList(navigation);

    const navigateToEntityDetailsScreenTap = navigateToEntityDetailsScreen(navigation);
    const navigateToPropertyDetailsScreenTap = navigateToPropertyDetailsScreen(navigation);
    const navigateToUnitDetailsScreenTap = navigateToUnitDetailsScreen(navigation);
    const navigateToMaintenanceDetailsScreenTap = navigateToMaintenanceDetailsScreen(navigation);
    const navigateToToDoDetailsScreenTap = navigateToToDoDetailsScreen(navigation);

    return (
        <Screen scrollable withSafeArea>
            <Stack fill >
                <Stack alignCenter>
                    {backupStatus !== 'success' && <Backup />}
                    <Spacer size="large" />
                    <Spacer size="small" />

                    <GlobalSearch />

                    <Spacer size="small" />

                    <NavigationSwipe showEntityList={navigateToEntityListTap}
                        showPropertyList={navigateToPropertyListTap}
                        showUnitsList={navigateToUnitListTap} showMaintenanceList={navigateToMaintenanceListTap} showToDoList={navigateToToDoListTap}
                        showEntityDetails={navigateToEntityDetailsScreenTap}
                        showPropertyDetails={navigateToPropertyDetailsScreenTap} showUnitDetails={navigateToUnitDetailsScreenTap} showMaintenanceDetails={navigateToMaintenanceDetailsScreenTap} showToDoDetails={navigateToToDoDetailsScreenTap}
                    />

                    <Spacer size="small" />

                    <NearbyObjects />
                </Stack>
            </Stack>
        </Screen>
    );
});


export const HomeScreen = React.memo(() => {
    const { state } = useAuth();
    console.log("HomeScreen rendered");

    if (state !== "AUTHORIZED") {
        console.log("HomeScreen showing spinner");
        return <Spinner visible />;
    }

    return <HomeScreenContent />
});




