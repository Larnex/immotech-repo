import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { cacheUnitsByParent, useMutation, useQuery } from '@immotech-feature/api';
import { ThreeDModels } from '@immotech-feature/property-api';
import { useQueries } from '@tanstack/react-query';
import { useFetch } from '@immotech-feature/api/src/use-fetch';
import { MaintenanceFormType } from '../../maintenance-api/src/use-maintenance';

export interface UnitResponse {
  nid?: string;
  title: string;
  id: string;
  parent_id?: string;
  city?: string;
  street?: string;
  zip_code?: string;
  type?: string;
  maintenancesAmount?: number;
  todosAmount?: number;
  lat?: string;
  lon?: string;
  key?: string;
  parentName?: string;
}

export interface UnitInputType {
  title: string;
  nid: string;
  field_utilization_unit_assign: any;
  field_utilization_unit_address: {
    und: [
      {
        thoroughfare: string;
        postal_code: string;
        locality: string;
        country: string;
      },
    ];
  };
  field_utilization_unit_typ: any;

  field_utilization_unit_id: {
    und?: [{ value?: string }];
  };

  field_utilization_unit_geofield?: {
    und: [
      {
        lat: string;
        lon: string;
      },
    ];
  };

  field_test_protocols: {
    und:
      | [
          {
            url?: string;
            timestamp?: string;
            filename?: string;
          },
        ]
      | [];
  };

  field_3d_models: {
    und: [ThreeDModels] | [];
  };
}

export interface UnitInputFormType {
  title: string;
  field_utilization_unit_id: {
    und: [{ value: string }];
  };
  field_utilization_unit_assign: string;
  field_utilization_unit_address: {
    und: [
      {
        thoroughfare: string;
        postal_code: string;
        locality: string;
        country: string;
      },
    ];
  };
  field_utilization_unit_typ: any;

  field_utilization_unit_geofield?: {
    und: [
      {
        lat: string;
        lon: string;
      },
    ];
  };
}

interface Request {
  nid?: string;
  internalID?: string;
  object?: string;
}

export type Response = {
  nid: string;
  uri: string;
};

export function useUnits(options?: any) {
  const queryClient = useQueryClient();
  return useQuery<UnitResponse[]>('/api/app/utilization_units', ['units'], {
    ...options,
    onSuccess(data) {
      cacheUnitsByParent(data, queryClient);
    },
  });
}

export function useUnitsByProperty({ nid, internalID }: Request) {
  return useQuery<UnitResponse[]>(!!nid ? `/api/app/utilization_units?property_id=${nid}` : '', [
    `units:${nid ? nid : internalID}`,
  ]);
}

export function useUnit({ nid, internalID, object }: Request) {
  return useQuery<UnitInputType>(
    `/api/app/utilization_units/${nid}`,
    [`unit:${nid ? nid : internalID}`],
    {
      enabled: object === 'unit',
    },
  );
}

export function useAddUnit() {
  const queryClient = useQueryClient();

  return useMutation<Response, UnitInputFormType>('/api/app/utilization_units', {
    method: 'POST',
    mutationKey: ['units'],

    onSuccess: (data, variables) => {
      queryClient.setQueryData(['units'], (oldUnits: UnitResponse[] | undefined) => {
        if (!oldUnits) return [];

        return oldUnits?.map(unit => {
          if (unit?.id === variables.field_utilization_unit_id.und[0].value) {
            return {
              ...unit,
              nid: data.nid,
            };
          }

          return unit;
        });
      });

      queryClient.setQueryData([`units:${variables.field_utilization_unit_assign}`], (old: any) => {
        return old
          ? [
              ...old,
              {
                nid: data.nid,
                title: variables.title,
                id: variables.field_utilization_unit_id.und[0].value,
                type: variables.field_utilization_unit_typ?.und?.[0],
                city: variables.field_utilization_unit_address?.und[0]?.locality,
                zip_code: variables.field_utilization_unit_address?.und[0]?.postal_code,
                street: variables.field_utilization_unit_address?.und[0]?.thoroughfare,
                parent_id: variables.field_utilization_unit_assign,
              },
            ]
          : [
              {
                nid: data.nid,
                title: variables.title,
                id: variables.field_utilization_unit_id.und[0].value,
                type: variables.field_utilization_unit_typ?.und?.[0],
                city: variables.field_utilization_unit_address?.und[0]?.locality,
                zip_code: variables.field_utilization_unit_address?.und[0]?.postal_code,
                street: variables.field_utilization_unit_address?.und[0]?.thoroughfare,
                parent_id: variables.field_utilization_unit_assign,
              },
            ];
      });

      queryClient.removeQueries([`unit:${variables?.field_utilization_unit_id?.und?.[0]?.value}`], {
        exact: true,
      });

      queryClient.removeQueries([
        `todosbyUnit:${variables?.field_utilization_unit_id?.und?.[0]?.value}`,
      ]);

      queryClient.removeQueries([
        `maintenancesbyUnit:${variables?.field_utilization_unit_id?.und?.[0]?.value}`,
      ]);

      const mutationMaintenanceCache = queryClient.getMutationCache().findAll({
        mutationKey: ['maintenances'],
      });

      if (mutationMaintenanceCache) {
        mutationMaintenanceCache?.map(maintenance => {
          if (
            (maintenance.state.variables! as MaintenanceFormType)
              .field_buildingservice_assignment ===
            (variables as UnitInputType).field_utilization_unit_id?.und?.[0]?.value
          ) {
            maintenance.setState({
              variables: {
                ...(maintenance?.state?.variables ?? {}),
                field_buildingservice_assignment: data?.nid!,
              },
            } as any);
          }
        });
      }
    },
  });
}

export function useEditUnit({ nid }: Request) {
  const queryClient = useQueryClient();

  return useMutation<Response, UnitInputFormType>(`/api/app/utilization_units/${nid}`, {
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries([`unit:${nid}`]);
    },
  });
}

export function useDeleteUnit({ nid }: Request) {
  return useMutation<any>(`/api/app/utilization_units/${nid}`, {
    method: 'DELETE',
  });
}

const fetchUnitsByParentId = async (nid: string) => {
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/utilization_units?property_id=${nid}`);

  const data = await response().then(res => res);

  return data!.length > 0 ? data : null;
};

const fetchUnitsDetails = async (nid: string) => {
  // const backUpSuccess = await AsyncStorage.getItem('backupStatus');
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/utilization_units/${nid}`);

  const data = await response().then(res => res);

  return data;
};

export function useAllUnitsByParentId(nid: string[], internalIDs: string[], options?: any) {
  return useQueries({
    queries: nid.map((nid, index) => ({
      queryKey: [`units:${nid ? nid : internalIDs[index]}`],
      queryFn: () => fetchUnitsByParentId(nid),
      options,
    })),
  });
}

export function useAllUnitsDetails(nid: string[], internalIDs: string[], options?: any) {
  return useQueries({
    queries: nid.map((nid, index) => ({
      queryKey: [`unit:${nid ? nid : internalIDs[index]}`],
      queryFn: options.enabled ? () => fetchUnitsDetails(nid) : undefined,
      options,
    })),
  });
}
