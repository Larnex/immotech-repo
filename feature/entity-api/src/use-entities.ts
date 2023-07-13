import { QueryOptions, useMutation, useQuery } from '@immotech-feature/api';
import { useFetch } from '@immotech-feature/api/src/use-fetch';
import { useQueries, useQueryClient, useQuery as RQuseQuery } from '@tanstack/react-query';
import { fetchMapSnapshot } from '@immotech/util';
import { PropertyInputType } from '../../property-api/src/use-property';

export interface EntityType {
  nid?: string;
  title: string;
  field_account_entity_postalcode: PostalCode;
  field_account_entity_city: City;
  field_account_entity_id: ID;
}

export type Entity = {
  nid?: string;
  title: string;
  created?: string;
  changed?: string;
  id: string;
  zip_code?: string;
  city?: string;
  key?: string;
  propertiesAmount?: number;
  timestamp?: number;
  image?: string;
};

interface ID {
  [key: string]: IdEntity[];
}

interface IdEntity {
  value: string;
}

export interface PostalCode {
  und: PostalCodeObject[];
}

interface City {
  und: PostalCodeObject[];
}

interface PostalCodeObject {
  value?: string;
  format?: string | null;
  safe_value?: string;
}

interface Request {
  nid?: string;
  internalID?: string;
}

interface Response {
  nid: string;
  url: string;
}

export function useEntities(options?: any) {
  const queryClient = useQueryClient();

  return useQuery<Entity[]>(`/api/app/accounting_entity`, ['entities'], {
    onSuccess: async entities => {
      const updatedEntities = await Promise.all(
        entities.map(async entity => {
          if (entity.image) {
            return;
          }
          try {
            const snapshotUrl = await fetchMapSnapshot(entity.city!);

            return { ...entity, image: snapshotUrl };
          } catch (error) {
            console.error(`Failed to fetch map snapshot for city: ${entity.city}`, error);
            return entity;
          }
        }),
      );
      queryClient.setQueryData(['entities'], updatedEntities);
    },
  });
}

export function useEntity({ nid, internalID }: Request) {
  return useQuery<any>(`/api/app/accounting_entity/${nid}`, [`entity:${nid ? nid : internalID}`]);
}

export function useAddEntity() {
  const queryClient = useQueryClient();
  return useMutation<Response, EntityType>('/api/app/accounting_entity', {
    method: 'POST',
    mutationKey: ['entities'],
    onSettled: data => {},
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['entities']);

      queryClient.removeQueries([`entity:${variables.field_account_entity_id?.und?.[0]?.value}`]);

      queryClient.removeQueries([
        `properties:${variables.field_account_entity_id?.und?.[0]?.value}`,
      ]);

      // get mutation cache by mutation key
      const mutationCache = queryClient.getMutationCache().findAll({
        mutationKey: ['properties'],
      });
      if (mutationCache) {
        mutationCache?.map(property => {
          if (
            (property.state.variables! as PropertyInputType).field_property_accounting_entity ===
            (variables as EntityType).field_account_entity_id?.und?.[0].value
          ) {
            property.setState({
              variables: {
                ...(property?.state?.variables ?? {}),
                field_property_accounting_entity: data?.nid!,
              },
            } as any);
          }
        });
      }
    },
    onError: error => {},
  });
}

export function useEditEntity({ nid, internalID }: Request) {
  const queryClient = useQueryClient();

  return useMutation<Response, EntityType>(`/api/app/accounting_entity/${nid}`, {
    method: 'PUT',
    mutationKey: [`entity:${nid ? nid : internalID}`],
    onSuccess: () => {
      queryClient.invalidateQueries([`entity:${nid ? nid : internalID}`]);
    },
  });
}

export function useDeleteEntity({ nid, internalID }: Request) {
  const queryClient = useQueryClient();

  // remove from cache
  queryClient.removeQueries([`entity:${nid ? nid : internalID}`]);

  return useMutation<any>(`/api/app/accounting_entity/${nid}`, {
    mutationKey: ['entities', `entity:${nid ? nid : internalID}`],
    method: 'DELETE',
  });
}

const fetchDetailsOfAllEntities = async (nid: string) => {
  if (!nid) {
    return;
  }
  const response = useFetch('GET', `/api/app/accounting_entity/${nid}`);
  const data = await response().then(res => res);
  return data;
};

export function useDetailsOfAllEntities(nid: string[], internalIDs: string[], options?: any) {
  return useQueries({
    queries: nid.map((nid, index) => ({
      queryKey: [`entity:${nid ? nid : internalIDs[index]}`],
      queryFn: options.enabled ? () => fetchDetailsOfAllEntities(nid) : undefined,
      options,
    })),
  });
}

// const fetchMapSnapshot = async (city: string) => {
//   // Your logic to fetch the map snapshot for the given city, e.g., using the geocodeCity function
//   // Return the static map image URI or base64 encoded image
// };

// export function useMapSnapshot(city: string) {
//   return RQuseQuery(['entities'], () => fetchMapSnapshot(city), {
//     staleTime: Infinity, // Prevents refetching on every render
//   });
// }
