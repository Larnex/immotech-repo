import { useQueryClient } from '@tanstack/react-query';
import { cacheTodosByParent, useMutation, useQuery } from '@immotech-feature/api';
import { useQueries } from '@tanstack/react-query';
import { useFetch } from '@immotech-feature/api/src/use-fetch';
import { useDelete } from '@immotech-feature/api/src/use-delete';

export type ToDoListResponse = {
  nid: string;
  title: string;
  created: string;
  assigned_entity_type: string;
  assigned_entity_title: string;
  assigned_entity_id: string;
  cost: string;
  priority?: string;
  status: string;
  short_description?: string;
  long_description?: string;
  key?: number;
  image?: string;
  id?: string;
  responsible?: string;
};

export type ToDoResponse = {
  created: string;
  changed: string;
  nid: string;

  field_todo_assignment: {
    und: [
      {
        target_id: string;
      },
    ];
  };

  field_todo_pictures:
    | {
        und: [
          {
            filename: string;
            uri: string;
          },
        ];
      }
    | [];

  field_todo_description:
    | {
        und?: [
          {
            value?: string;
          },
        ];
      }
    | [];

  field_todo_short_desc:
    | {
        und?: [
          {
            value?: string;
          },
        ];
      }
    | [];
  field_todo_value: {
    und: [
      {
        value: string;
      },
    ];
  };
  field_todo_priority?: {
    und?: [
      {
        value?: string;
      },
    ];
  };
  field_todo_status: {
    und: [
      {
        value: string;
      },
    ];
  };

  field_todo_note:
    | {
        und?: [
          {
            value?: string;
          },
        ];
      }
    | [];

  field_todo_responsible?:
    | {
        und?: [
          {
            value?: string;
          },
        ];
      }
    | [];
};

export interface AddReportFormType {
  field_todo_assignment: string;

  field_todo_description?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_todo_short_desc?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_todo_note?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_todo_value: {
    und: [
      {
        value: string;
      },
    ];
  };

  field_todo_priority?: {
    und?: string;
  };

  field_todo_status?: {
    und?: string;
  };

  field_todo_responsible?: {
    und?: [
      {
        value?: string;
      },
    ];
  };

  field_todo_pictures?: string[];
}

interface Request {
  nid?: string;
  internalID?: string;
}

export interface ReportItemType {
  id: string;
  image: string;
  issue: string;
}

interface Response {
  nid: string;
  uri: string;
}

interface DeleteImageRequest {
  field_todo_pictures: {
    [key: string]: 'delete';
  };
}

export function useAddReport() {
  const queryClient = useQueryClient();

  return useMutation<Response, AddReportFormType>('/api/app/todo', {
    method: 'POST',
    mutationKey: ['todos'],
    onSuccess(data, variables, context) {
      queryClient.setQueryData([`todos`], (oldTodos: ToDoListResponse[] | undefined) => {
        if (!oldTodos) return [];

        return oldTodos?.map(todo => {
          if (todo?.id) {
            const updatedTodo = { ...todo, nid: data.nid };
            delete updatedTodo.id; // Delete the id property
            queryClient.removeQueries([`todo:${todo?.id}`]);
            return updatedTodo;
          }
          return todo;
        });
      });

      const keys = [
        `todosbyMaintenance:${variables?.field_todo_assignment}`,
        `todosbyUnit:${variables?.field_todo_assignment}`,
        `todosbyProperty:${variables?.field_todo_assignment}`,
      ];

      keys.forEach(key => {
        // Check if the key exists in the cache
        const existingData = queryClient.getQueryData([key]);

        // If key exists, update data for that key
        if (existingData) {
          queryClient.setQueryData([key], (old: any) => {
            // Filtering out the old todo with the id key
            const filteredOld = old ? old.filter((item: any) => !item.id) : [];

            // Creating a new todo object
            const newTodo = {
              nid: data.nid,
              title: `ToDo #${data.nid}`,
              assigned_entity_id: variables?.field_todo_assignment,
              short_description: variables?.field_todo_short_desc?.und?.[0]?.value,
              cost: variables?.field_todo_value?.und?.[0]?.value,
              priority: variables?.field_todo_priority?.und,
              status: variables?.field_todo_status?.und,
              responsible: variables?.field_todo_responsible?.und?.[0]?.value,
            };

            // Returning the new array combining the filtered old todos and the new todo
            return [...filteredOld, newTodo];
          });
        }
      });
    },
  });
}

export function useEditReport({ nid }: Request) {
  const queryClient = useQueryClient();

  return useMutation<Response, AddReportFormType>(`/api/app/todo/${nid}`, {
    method: 'PUT',
    mutationKey: [`todo:${nid}`],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries([`todo:${nid}`]);
    },
  });
}

export function useDeleteImage({ nid }: Request) {
  return useMutation<Response, DeleteImageRequest>(`/api/app/todo/${nid}`, {
    method: 'PUT',
  });
}

export function useToDosById({ nid, internalID }: Request) {
  return useQuery<ToDoListResponse[]>(!!nid ? `/api/app/todo?parent_id=${nid}` : '', [
    `todos:${nid ? nid : internalID}`,
  ]);
}

export function useToDos(options?: any) {
  const queryClient = useQueryClient();

  return useQuery<ToDoListResponse[] | []>(`/api/app/todo`, [`todos`], {
    ...options,
    onSuccess(data) {
      cacheTodosByParent(data, queryClient);
    },
  });
}

export function useToDo({ nid }: Request) {
  // TODO: make todo response type
  return useQuery<ToDoResponse>(`/api/app/todo/${nid}`, [`todo:${nid}`], {
    enabled: !!nid,
  });
}

export function useToDoEdit({ nid }: Request) {
  return useMutation<any>(`/api/app/todo/${nid}`, {
    method: 'PUT',
  });
}

export function useDeleteToDo() {
  const mutation = useDelete<any, Error, string>((nid: string) => {
    return {
      url: `/api/app/todo/${nid}`,
      method: 'DELETE',
    };
  });

  const deleteToDo = async (nid: string) => {
    if (nid) {
      await mutation.mutateAsync(nid);
    } else {
      
    }
  };

  return {
    ...mutation,
    mutateAsync: deleteToDo,
  };
}

const fetchAllTodosByParentId = async (nid: string) => {
  if (!nid) return;

  const response = useFetch('GET', `/api/app/todo?parent_id=${nid}`);

  const data = await response().then(res => res);

  return data?.length > 0 ? data : [];
};

const fetchAllTodosDetails = async (nid: string) => {
  if (!nid) return;

  const response = useFetch('GET', `/api/app/todo/${nid}`);

  const data = await response().then(res => res);

  return data;
};

export function useAllTodosByParentId(
  nid: string[],
  internalIDs: string[],
  type: 'unit' | 'property' | 'maintenance',
  options?: any,
) {
  return useQueries({
    queries: nid.map((id, index) => ({
      queryKey: [
        `todos${
          type === 'unit'
            ? `byUnit:${id ? id : internalIDs[index]}`
            : type === 'property'
            ? `byProperty:${id ? id : internalIDs[index]}`
            : `byMaintenance:${id ? id : internalIDs[index]}`
        }`,
      ],
      queryFn: () => fetchAllTodosByParentId(id),
      options,
    })),
  });
}

export function useAllTodosDetails(nid: string[], options?: any) {
  return useQueries({
    queries: nid.map(id => ({
      queryKey: [`todo:${id}`],
      queryFn: options.enabled ? () => fetchAllTodosDetails(id) : undefined,
      options,
    })),
  });
}
