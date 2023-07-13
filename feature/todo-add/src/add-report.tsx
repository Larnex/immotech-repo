import { useProperty } from "@immotech-feature/property-api";
import { useUnit } from "@immotech-feature/unit-api";
import React from "react";
import { AddReportFormType, useAddReport } from "../../todo-api/src/use-reports";
import { ReportForm } from "./report-form";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess?: () => void;
  property?: string;
  unit?: string;
  isMaintenance?: boolean;
  entity?: string;
  maintenance?: string;
}

export const AddReport = ({ onSuccess, property, unit, isMaintenance, entity, maintenance }: Props) => {

  const queryClient = useQueryClient();

  const { data: propertyData, isLoading: propertyLoading } = useProperty({
    nid: property,
  });

  const entityId = entity ? entity : propertyData?.field_property_accounting_entity.und[0].target_id

  const { mutate: addReport, isLoading, error } = useAddReport();


  const onAddReportTap = (todo: AddReportFormType, parentKey: string) => {
    const tempId = "temp_" + Date.now();
    // let parentKey: any;
    // if (maintenance !== null) {
    //   parentKey = `todosByMaintenance:${maintenance}`;
    // } else if (unit !== null) {
    //   parentKey = `todosByUnit:${unit}`;
    // } else if (property !== null) {
    //   parentKey = `todosByProperty:${property}`;
    // }

    if (parentKey) {
      queryClient.setQueryData([parentKey], (old: any) => {
        const assigned_entity_type = maintenance
          ? 'building_services'
          : unit
            ? 'utilization_unit'
            : property
              ? 'property'
              : undefined;

        const newTodo = {
          id: tempId,
          created: new Date(),
          short_description: todo?.field_todo_short_desc?.und?.[0]?.value,
          status: todo?.field_todo_status?.und,
          cost: todo?.field_todo_value?.und?.[0]?.value,
          priority: todo?.field_todo_priority?.und,
          assigned_entity_id: todo?.field_todo_assignment,
          assigned_entity_type: assigned_entity_type
        };

        return old
          ? [...old, newTodo]
          : [newTodo];
      });
    }

    queryClient.setQueryData(['todos'], (old: any) => {
      return old ? [...old, {
        ...todo, id: tempId,
        created: new Date(),
        short_description: todo?.field_todo_short_desc?.und?.[0]?.value,
        status: todo?.field_todo_status?.und,
        cost: todo?.field_todo_value?.und?.[0]?.value,
        priority: todo?.field_todo_priority?.und,
      }] : [{
        ...todo, id: tempId,
        created: new Date(),
        short_description: todo?.field_todo_short_desc?.und?.[0]?.value,
        status: todo?.field_todo_status?.und,
        cost: todo?.field_todo_value?.und?.[0]?.value,
        priority: todo?.field_todo_priority?.und,
      }];
    });

    queryClient.setQueryData([`todo:${tempId}`], () => ({ ...todo }));

    addReport({ ...todo });
    onSuccess?.();
  };



  return (
    <ReportForm
      onSubmit={onAddReportTap}
      error={error}
      entityId={entityId}
      propertyId={property}
      unitId={unit}
      maintenanceId={maintenance}
      todoFormLoading={isLoading}
      isMaintenance={isMaintenance}
      defaultId={property!}
    />
  );
};

