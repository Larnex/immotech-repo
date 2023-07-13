import { useDetailsOfAllEntities, useEntities } from '@immotech-feature/entity-api';
import {
  useAllMaintenancesDetails,
  useMaintenances,
  useMepTypes
} from '@immotech-feature/maintenance-api';
import {
  getAllProperties,
  useAllPropertiesDetails,
  useAttributes,
  usePropertyTypes
} from '@immotech-feature/property-api';
import { useAllTodosDetails, useToDos } from '@immotech-feature/todo-api';
import { useAllUnitsDetails, useUnits } from '@immotech-feature/unit-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useAuth } from '../../auth/src/use-auth';

export function Backup() {

  const [isBackupRunning, setIsBackupRunning] = React.useState(false);
  const [shouldRunBackup, setShouldRunBackup] = React.useState(false);
  const [isBackupNeeded, setIsBackupNeeded] = React.useState<boolean | null>(null);

  const { user } = useAuth();
  // if (!user) {
  //   return null;
  // }



  React.useEffect(() => {
    const checkBackupStatus = async () => {
      // Check if the backup has already been done successfully
      const backupStatus = await AsyncStorage.getItem('backupStatus');
      if (backupStatus === 'success') {
        // Backup has already been done successfully, no need to run again
        setIsBackupNeeded(false);
      } else {
        setIsBackupNeeded(true);
        setIsBackupRunning(true);
        setShouldRunBackup(true);
      }
    };
    checkBackupStatus();
  }, []);


  const options = React.useMemo(() => ({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    suspense: true,
    enabled: !!isBackupNeeded,
  }), [isBackupNeeded]);
  const { data: entities, isLoading: entitiesLoading } = useEntities(options);
  const { data: properties, isLoading: propertiesLoading } = getAllProperties(options);
  const { data: units, isLoading: unitsLoading } = useUnits(options);
  const { data: maintenances, isLoading: maintenanceLoading } = useMaintenances(options);
  const { data: todos, isLoading: todosLoading } = useToDos(options);
  usePropertyTypes(options);
  useAttributes(options);
  useMepTypes(options);
  const entityDetailsResult = useDetailsOfAllEntities(
    entities?.map(entity => entity?.nid as string) || [],
    entities?.map(entity => entity?.id as string) || [],
    options
  );

  const propertiesDetailsResult = useAllPropertiesDetails(
    properties?.map(property => property?.nid as string) || [],
    properties?.map(property => property?.id as string) || [],
    options
  );

  const unitDetailsResult = useAllUnitsDetails(
    units?.map(unit => unit?.nid!) || [],
    units?.map(unit => unit?.id) || [],
    options
  );

  const maintenanceDetailsResult = useAllMaintenancesDetails(
    maintenances?.map(maintenance => maintenance?.nid!) || [],
    maintenances?.map(maintenance => maintenance?.name!) || [],
    options
  );

  const todoDetailsResult = useAllTodosDetails(todos?.map(todo => todo?.nid) || [], options);

  const isEntityDetailsLoading = entityDetailsResult.some(result => result.isLoading);
  const isPropertiesDetailsLoading = propertiesDetailsResult.some(result => result.isLoading);
  const isUnitDetailsLoading = unitDetailsResult.some(result => result.isLoading)
  const isMaintenanceDetailsLoading = maintenanceDetailsResult.some(result => result.isLoading);
  const isTodoDetailsLoading = todoDetailsResult.some(result => result.isLoading);

  const loadingStates = [
    entitiesLoading,
    propertiesLoading,
    unitsLoading,
    maintenanceLoading,
    todosLoading,
    isEntityDetailsLoading,
    isPropertiesDetailsLoading,
    isUnitDetailsLoading,
    isMaintenanceDetailsLoading,
    isTodoDetailsLoading,
  ];

  const isAnyLoading = loadingStates.some(isLoading => isLoading);

  React.useEffect(() => {
    let isMounted = true;

    if (!isBackupRunning) {
      return;
    }

    (async () => {
      try {
        await AsyncStorage.setItem('backupStatus', 'success');


        if (isMounted) { // Only update the state if the component is still mounted
          setIsBackupRunning(false);
        }
      } catch (error) {
        console.error('Failed to set backup status:', error);
      }
    })();

    return () => { // Cleanup function to set isMounted to false when unmounting
      isMounted = false;
    };
  }, [isAnyLoading, isBackupRunning]);



  // return <LoadingBackUpSpinner isLoading={isBackupRunning} />;
  return isAnyLoading ? <Spinner visible /> : null;
}
