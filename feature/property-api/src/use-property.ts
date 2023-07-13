import { PropertiesList } from '@immotech-feature/property-list';
import { useFetch } from '@immotech-feature/api/src/use-fetch';
import { cachePropertiesByParent, useMutation, useQuery } from '@immotech-feature/api';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { UnitInputFormType } from '../../unit-api/src/use-units';
import { MaintenanceFormType } from '../../maintenance-api/src/use-maintenance';

export type AttributesList = {
  build_year: string;
  insurance: string;
  last_modernization: string;
  electricity_provider: string;
  living_space: string;
  count_flats: string;
  floors: string;
  elevator: string;
  dormer: string;
  rooftop_windows: string;
  rooftop_area: string;
  facade_area: string;
  light_dome: string;
  lightband_roof: string;
  district: string;
  owner: string;
  development_plan: string;
  site_designation: string;
  building_regulations_law: string;
  commercial_space: string;
  current_use: string;
  opening: string;
  contact: string;
  technical_drawing: string;
  glass_area: string;
  num_parking_spaces: string;
};

type BuildAttribute = {
  id: string;
  attribute: string;
  value: string;
};

export interface PropertyDataType {
  nid?: string;
  title: string;
  type: string;
  field_property_address: {
    und: [
      {
        thoroughfare: string;
        postal_code: string;
        locality: string;
        country: string;
      },
    ];
  };

  field_property_id: {
    und: [{ value: string }];
  };

  field_property_overview_picture?: {
    und: [
      {
        filename: string;
      },
    ];
  };

  field_property_accounting_entity: {
    und: [{ target_id: string }];
  };

  field_property_geofield?: {
    und: [
      {
        lat: string;
        lon: string;
      },
    ];
  };

  field_property_type?: any;

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

  field_build_attributes?: {
    und: BuildAttribute[];
  };
}

export type ThreeDModels = {
  url: string;
  type: 'outdoor' | 'outdoorthermo' | 'technical';
  timestamp: number;
};

export interface PropertyInputType {
  title: string;
  field_property_id: {
    und: [{ value: string }];
  };

  field_property_accounting_entity: string;

  field_property_address: {
    und: [
      {
        thoroughfare: string;
        postal_code: string;
        locality: string;
      },
    ];
  };

  field_property_type?: {
    und: [string];
  };

  field_property_overview_picture?: string;

  field_build_attributes?: {
    und: [PropertyAttributes];
  };
}

export type PropertyListResponse = {
  nid: string;
  title: string;
  created?: string;
  id: string;
  street?: string;
  zip_code?: string;
  city?: string;
  image?: string;
  key?: string;
  unitsAmount?: number;
  maintenancesAmount?: number;
  todosAmount?: number;
  lat?: string;
  lon?: string;
  distance?: string;
  parent_id?: string;
  type?: string;
};

interface PropertyAttributes {
  field_build_attributes_value: {
    und: [{ value: string }];
  };
  field_build_attributes_attribute: {
    und: any;
  };
}

interface Request {
  nid?: string;
  internalID?: string;
  object?: string;
}

interface Response {
  nid: string;
  uri: string;
}

export function usePropertiesByEntity({ nid, internalID }: Request) {
  return useQuery<PropertyListResponse[]>(
    !!nid ? `/api/app/property?accounting_entity_id=${nid}` : '',
    [`properties:${nid ? nid : internalID}`],
  );
}

export function getAllProperties(options?: any) {
  const queryClient = useQueryClient();

  
  return useQuery<PropertyListResponse[]>(`/api/app/property`, ['properties'], {
    ...options,
    onSuccess(data) {
      
      cachePropertiesByParent(data, queryClient);
    },
  });
}

export function useProperty({ nid, internalID, object }: Request) {
  return useQuery<PropertyDataType>(
    `/api/app/property/${nid}`,
    [`property:${nid ? nid : internalID}`],
    {
      enabled: object === 'property',
    },
  );
}

export function usePropertyImage({ nid }: any) {
  if (nid == undefined) {
    return;
  }

  return useQuery<any>(`/system/files/${nid}`, [`property-image:${nid}`], {
    enabled: !!nid,
  });
}

export function useAddProperty() {
  const queryClient = useQueryClient();

  return useMutation<Response, PropertyInputType>('/api/app/property', {
    mutationKey: ['properties'],
    method: 'POST',

    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [`properties`],
        (oldProperties: PropertyListResponse[] | undefined) => {
          if (!oldProperties) return [];

          return oldProperties.map(property => {
            if (property.id === variables.field_property_id.und[0].value) {
              return {
                ...property,
                nid: data.nid,
              };
            }
            return property;
          });
        },
      );

      queryClient.setQueryData(
        [`properties:${variables.field_property_accounting_entity}`],
        (old: any) => {
          return old
            ? [
                ...old,
                {
                  nid: data.nid,
                  title: variables.title,
                  id: variables.field_property_id.und[0].value,
                  type: variables.field_property_type?.und?.[0],
                  city: variables.field_property_address.und[0].locality,
                  zip_code: variables.field_property_address.und[0].postal_code,
                  street: variables.field_property_address.und[0].thoroughfare,
                  parent_id: variables.field_property_accounting_entity,
                },
              ]
            : [
                {
                  nid: data.nid,
                  title: variables.title,
                  id: variables.field_property_id.und[0].value,
                  type: variables.field_property_type?.und?.[0],
                  city: variables.field_property_address.und[0].locality,
                  zip_code: variables.field_property_address.und[0].postal_code,
                  street: variables.field_property_address.und[0].thoroughfare,
                  parent_id: variables.field_property_accounting_entity,
                },
              ];
        },
      );

      queryClient.removeQueries([`property:${variables?.field_property_id?.und?.[0]?.value}`]);

      queryClient.removeQueries([
        `todosbyProperty:${variables?.field_property_id?.und?.[0]?.value}`,
      ]);

      queryClient.removeQueries([
        `maintenancesbyProperty:${variables?.field_property_id?.und?.[0]?.value}`,
      ]);

      queryClient.removeQueries([`units:${variables?.field_property_id?.und?.[0]?.value}`]);

      const mutationUnitsCache = queryClient.getMutationCache().findAll({
        mutationKey: ['units'],
      });

      if (mutationUnitsCache) {
        mutationUnitsCache?.map(unit => {
          if (
            (unit.state.variables! as UnitInputFormType).field_utilization_unit_assign ===
            (variables as PropertyInputType).field_property_id?.und?.[0]?.value
          ) {
            unit.setState({
              variables: {
                ...(unit?.state?.variables ?? {}),
                field_utilization_unit_assign: data?.nid!,
              },
            } as any);
          }
        });
      }

      const mutationMaintenanceCache = queryClient.getMutationCache().findAll({
        mutationKey: ['maintenances'],
      });

      if (mutationMaintenanceCache) {
        mutationMaintenanceCache?.map(maintenance => {
          if (
            (maintenance.state.variables! as MaintenanceFormType)
              .field_buildingservice_assignment ===
            (variables as PropertyInputType).field_property_id?.und?.[0]?.value
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

      const mutationToDoCache = queryClient.getMutationCache().findAll({
        mutationKey: ['todos'],
      });
    },
  });
}

export function useEditProperty({ nid, internalID }: Request) {
  const queryClient = useQueryClient();

  return useMutation<Response, PropertyInputType>(`/api/app/property/${nid}`, {
    method: 'PUT',
    mutationKey: [`property:${nid ? nid : internalID}`],
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries([`property:${nid ? nid : internalID}`]);
    },
  });
}

export function usePropertyTypes(options?: any) {
  return useQuery<any>('/api/app/object_types', ['property-types'], options);
}

export function useAttributes(options?: any) {
  return useQuery<AttributesList>('/api/app/attribute_types', ['attributes'], options);
}

export function useDeleteProperty({ nid }: Request) {
  return useMutation<any>(`/api/app/property/${nid}`, {
    method: 'DELETE',
  });
}

const fetchPropertiesByEntityId = async (nid: string) => {
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/property?accounting_entity_id=${nid}`);

  const data = await response().then(res => res);
  return data;
};

const fetchPropertiesDetails = async (nid: string) => {
  if (!nid) {
    return;
  }

  const response = useFetch('GET', `/api/app/property/${nid}`);

  const data = await response().then(res => res);

  return data;
};

export function usePropertiesByEntityId(nid: string[], internalID: string[], options?: any) {
  return useQueries({
    queries: nid.map((nid, index) => ({
      queryKey: [`properties:${nid ?? internalID[index]}`],
      queryFn: () => fetchPropertiesByEntityId(nid),
      options,
    })),
  });
}

export function useAllPropertiesDetails(nid: string[], internalIDs: string[], options?: any) {
  return useQueries({
    queries: nid.map((nid, index) => ({
      queryKey: [`property:${nid ? nid : internalIDs[index]}`],
      queryFn: options.enabled ? () => fetchPropertiesDetails(nid) : undefined,
      options,
    })),
  });
}
