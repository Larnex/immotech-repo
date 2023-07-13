import { QueryClient } from '@tanstack/react-query';
import { PropertyListResponse } from '../../property-api/src/use-property';
import { UnitResponse } from '../../unit-api/src/use-units';
import { MaintenanceListResponse } from '../../maintenance-api/src/use-maintenance';
import { ToDoListResponse } from '../../todo-api/src/use-reports';

export function cachePropertiesByParent(
  properties: PropertyListResponse[],
  queryClient: QueryClient,
) {
  properties.forEach(property => {
    // Cache the properties by their parent_id
    queryClient.setQueryData(
      [`properties:${property?.parent_id}`],
      (oldData: PropertyListResponse[] | undefined) => {
        // If oldData exists, check for duplicates before appending
        if (oldData) {
          // Check if the property already exists in oldData
          const isDuplicate = oldData.some(oldProperty => oldProperty.nid === property.nid);
          // If it's not a duplicate, append it to the oldData
          if (!isDuplicate) {
            return [...oldData, property];
          }
          // If it is a duplicate, return oldData unchanged
          return oldData;
        }
        // If oldData does not exist, return the new property as an array
        return [property];
      },
    );
  });
}

export function cacheUnitsByParent(units: UnitResponse[], queryClient: QueryClient) {
  units.forEach(unit => {
    queryClient.setQueryData([`units:${unit.parent_id}`], (oldData: UnitResponse[] | undefined) => {
      // If oldData exists, check for duplicates before appending
      if (oldData) {
        // Check if the property already exists in oldData
        const isDuplicate = oldData.some(oldUnits => oldUnits.nid === unit.nid);
        // If it's not a duplicate, append it to the oldData
        if (!isDuplicate) {
          return [...oldData, unit];
        }
        // If it is a duplicate, return oldData unchanged
        return oldData;
      }
      // If oldData does not exist, return the new unit as an array
      return [unit];
    });
  });
}

export function cacheMaintenanceByParent(
  maintenances: MaintenanceListResponse[],
  queryClient: QueryClient,
) {
  maintenances.forEach(maintenance => {
    if (maintenance.assigned_entity_type === 'property') {
      queryClient.setQueryData(
        [`maintenancesbyProperty:${maintenance.assigned_entity_id}`],
        (oldData: MaintenanceListResponse[] | undefined) => {
          // If oldData exists, check for duplicates before appending
          if (oldData) {
            // Check if the property already exists in oldData
            const isDuplicate = oldData.some(
              oldMaintenance => oldMaintenance.nid === maintenance.nid,
            );
            // If it's not a duplicate, append it to the oldData
            if (!isDuplicate) {
              return [...oldData, maintenance];
            }
            // If it is a duplicate, return oldData unchanged
            return oldData;
          }
          // If oldData does not exist, return the new maintenance as an array
          return [maintenance];
        },
      );
    }

    if (maintenance.assigned_entity_type === 'utilization_unit') {
      queryClient.setQueryData(
        [`maintenancesbyUnit:${maintenance.assigned_entity_id}`],
        (oldData: MaintenanceListResponse[] | undefined) => {
          // If oldData exists, check for duplicates before appending
          if (oldData) {
            // Check if the property already exists in oldData
            const isDuplicate = oldData.some(
              oldMaintenance => oldMaintenance.nid === maintenance.nid,
            );
            // If it's not a duplicate, append it to the oldData
            if (!isDuplicate) {
              return [...oldData, maintenance];
            }
            // If it is a duplicate, return oldData unchanged
            return oldData;
          }
          // If oldData does not exist, return the new maintenance as an array
          return [maintenance];
        },
      );
    }
  });
}

export function cacheTodosByParent(todos: ToDoListResponse[], queryClient: QueryClient) {
  todos.forEach(todo => {
    if (todo.assigned_entity_type === 'property') {
      queryClient.setQueryData(
        [`todosbyProperty:${todo.assigned_entity_id}`],
        (oldData: ToDoListResponse[] | undefined) => {
          // If oldData exists, check for duplicates before appending
          if (oldData) {
            // Check if the property already exists in oldData
            const isDuplicate = oldData.some(oldTodo => oldTodo.nid === todo.nid);
            // If it's not a duplicate, append it to the oldData
            if (!isDuplicate) {
              return [...oldData, todo];
            }
            // If it is a duplicate, return oldData unchanged
            return oldData;
          }
          // If oldData does not exist, return the new todo as an array
          return [todo];
        },
      );
    }

    if (todo.assigned_entity_type === 'utilization_unit') {
      queryClient.setQueryData(
        [`todosbyUnit:${todo.assigned_entity_id}`],
        (oldData: ToDoListResponse[] | undefined) => {
          // If oldData exists, check for duplicates before appending
          if (oldData) {
            // Check if the property already exists in oldData
            const isDuplicate = oldData.some(oldTodo => oldTodo.nid === todo.nid);
            // If it's not a duplicate, append it to the oldData
            if (!isDuplicate) {
              return [...oldData, todo];
            }
            // If it is a duplicate, return oldData unchanged
            return oldData;
          }
          // If oldData does not exist, return the new todo as an array
          return [todo];
        },
      );
    }

    if (todo.assigned_entity_type === 'building_services') {
      queryClient.setQueryData(
        [`todosbyMaintenance:${todo.assigned_entity_id}`],
        (oldData: ToDoListResponse[] | undefined) => {
          // If oldData exists, check for duplicates before appending
          if (oldData) {
            // Check if the property already exists in oldData
            const isDuplicate = oldData.some(oldTodo => oldTodo.nid === todo.nid);
            // If it's not a duplicate, append it to the oldData
            if (!isDuplicate) {
              return [...oldData, todo];
            }
            // If it is a duplicate, return oldData unchanged
            return oldData;
          }
          // If oldData does not exist, return the new todo as an array
          return [todo];
        },
      );
    }
  });
}
