import { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { cacheMaintenanceByParent, useMutation, useQuery } from '@immotech-feature/api';
import { useQueries } from '@tanstack/react-query';
import { useFetch } from '@immotech-feature/api/src/use-fetch';

export type MaintenanceListResponse = {
  nid?: string;
  title?: string;
  created?: string;
  assigned_entity_id: string;
  assigned_entity_type: string;
  assigned_entity_title: string;
  type: string;
  location?: string;
  key?: number;
  images?: string[] | null;
  name?: string;
  todosAmount?: number;
  responsible?: string;
};

type Response = {
  nid: string;
  uri: string;
};

export type MaintenanceFormType = {
  field_buildingservice_assignment: string;
  field_buildingservice_type: {
    und: [string];
  };
  field_buildingservice_name: {
    und: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_manufactur?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_buildingservice_subtype?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_buildingservice_base: {
    und: string;
  };
  field_buildingservice_multi: {
    und: [
      {
        value: string;
      },
    ];
  };

  field_buildingservice_number?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_notes?:
    | {
        und?: {
          field_fbn_title?: {
            und?: [
              {
                value?: string;
              },
            ];
          };
          field_fbn_text?: {
            und?: [
              {
                value?: string;
              },
            ];
          };
        }[];
      }
    | [];

  field_buildingservice_location?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_buildingservice_build_date?: {
    und?: [
      {
        value?: {
          date?: string;
        };
      },
    ];
  };

  field_buildingservice_responsibl?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_pictures?: string[];
};

export type MaintenanceResponse = {
  nid: string;
  title: string;
  created: string;
  field_buildingservice_name: {
    und: [
      {
        value: string;
      },
    ];
  };
  field_buildingservice_assignment: {
    und: [
      {
        target_id: string;
      },
    ];
  };

  field_buildingservice_type: {
    und: [
      {
        tid: string;
      },
    ];
  };

  field_buildingservice_subtype:
    | {
        und?: [
          {
            value?: string;
          },
        ];
      }
    | [];

  field_buildingservice_base: {
    und: [
      {
        value: string;
      },
    ];
  };

  field_buildingservice_notes?: {
    und?: [
      {
        id?: string;
        title?: string;
        text?: string;
      },
    ];
  };

  field_buildingservice_manufactur: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_build_date: {
    und?: [
      {
        value?: {
          date?: string;
        };
      },
    ];
  };

  field_buildingservice_pictures:
    | {
        und: [
          {
            filename?: string;
            uri?: string;
          },
        ];
      }
    | [];

  field_buildingservice_location?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_number?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_buildingservice_multi: {
    und: [
      {
        value: string;
      },
    ];
  };

  field_buildingservice_responsibl?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
};

export type EditMaintenanceForm = {
  name?: string;
  manufactur?: string;
  location?: string;
  buildDate?: Date;
  title_note?: string;
  amount?: string;
  subtype?: string;
  note?: string;
  service_provider?: string;
};

interface DeleteImageRequest {
  field_buildingservice_pictures: {
    [key: string]: 'delete';
  };
}

interface Request {
  nid?: string;
  queryClient?: QueryClient;
  internalID?: string;
  object?: 'unit' | 'property';
  enabled?: boolean;
}

export function useMepTypes(options?: any) {
  return useQuery<any>(`/api/app/mep_types`, [`mep_types`], options);
}

export function useMaintenances(options?: any) {
  const queryClient = useQueryClient();
  return useQuery<MaintenanceListResponse[]>(`/api/app/maintenance`, [`maintenances`], {
    ...options,
    onSuccess(data) {
      cacheMaintenanceByParent(data, queryClient);
    },
  });
}

export function useMaintenanceById({ nid, internalID, object }: Request) {
  return useQuery<MaintenanceListResponse[] | []>(
    !!nid ? `/api/app/maintenance?parent_id=${nid}` : '',
    [
      object === 'property'
        ? `maintenancesbyProperty:${nid ? nid : internalID}`
        : object === 'unit'
        ? `maintenancesbyUnit:${nid ? nid : internalID}`
        : `maintenances:${nid}`,
    ],
  );
}

export function useMaintenance({ nid, internalID }: Request) {
  return useQuery<MaintenanceResponse>(`/api/app/maintenance/${nid}`, [
    `maintenance:${nid ? nid : internalID}`,
  ]);
}

export function useAddMaintenance() {
  const queryClient = useQueryClient();
  return useMutation<Response, MaintenanceFormType>(`/api/app/maintenance`, {
    method: 'POST',
    mutationKey: ['maintenances'],
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['maintenances']);
      queryClient.invalidateQueries([`maintenances:${variables.field_buildingservice_assignment}`]);
    },
  });
}

export function useEditMaintenance({ nid, internalID }: Request) {
  const queryClient = useQueryClient();

  return useMutation<Response, MaintenanceFormType>(`/api/app/maintenance/${nid}`, {
    method: 'PUT',
    mutationKey: [`maintenance:${nid ? nid : internalID}`],

    onSuccess: () => {
      queryClient.invalidateQueries([`maintenance:${nid ? nid : internalID}`]);
    },
  });
}

export function useDeleteMaintenance({ nid, queryClient }: Request) {
  return useMutation<any>(`/api/app/maintenance/${nid}`, {
    method: 'DELETE',
  });
}

export function useDeleteImage({ nid }: Request) {
  return useMutation<Response, DeleteImageRequest>(`/api/app/maintenance/${nid}`, {
    method: 'PUT',
  });
}

const fetchAllMaintenancesByParentId = async (nid: string) => {
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/maintenance?parent_id=${nid}`);

  const data = await response().then(res => res);
  return data;
};

const fetchAllMaintenancesDetails = async (nid: string) => {
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/maintenance/${nid}`);

  const data = await response().then(res => res);

  return data;
};

export function useAllMaintenancesByParentId(
  nid: string[],
  internalIDs: string[],
  unit: boolean,
  options?: any,
) {
  return useQueries({
    queries: nid.map((id, index) => ({
      queryKey: [
        unit
          ? `maintenancesbyUnit:${id ? id : internalIDs[index]}`
          : `maintenancesbyProperty:${id ? id : internalIDs[index]}`,
      ],
      queryFn: () => fetchAllMaintenancesByParentId(id),
      options,
    })),
  });
}

export function useAllMaintenancesDetails(nid: string[], internalIDs: string[], options?: any) {
  return useQueries({
    queries: nid.map((id, index) => ({
      queryKey: [`maintenance:${id ? id : internalIDs[index]}`],
      queryFn: options.enabled ? () => fetchAllMaintenancesDetails(id) : undefined,
      options,
    })),
  });
}
