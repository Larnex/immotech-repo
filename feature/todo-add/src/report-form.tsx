import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { useEntities } from "@immotech-feature/entity-api";
import { createEntityPick, createMaintenancePick, createPropertyPick, createUnitResponsePick } from "@immotech-feature/maintenance-add/src/add-maintenance-form-utils";
import { useMaintenanceById, useMaintenances } from "@immotech-feature/maintenance-api";
import { usePropertiesByEntity } from "@immotech-feature/property-api";
import { AddReportFormType } from "@immotech-feature/todo-api";
import { CostsFormItem, IssueFormItem, NoteFormItem, ShortDescriptionFormItem } from "@immotech-feature/todo-form-items";
import { useUnitsByProperty } from "@immotech-feature/unit-api";
import { PickerItem } from "@immotech/util/src/types";
import { CameraIcon, CloseCircleIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageStyle, StyleProp, ViewProps } from "react-native";
import { COLOR_X } from "../../theme/src/theme";
import { ServiceProviderFormItem } from "@immotech-feature/maintenance-form-items/src/service-provider-form-item";

export type AddReportForm = {
  description?: string;
  short_description?: string;
  costs: string;
  note?: string;
  service_provider?: string;
};

export type Image = {
  path: string;
  data: string;
  existed?: boolean;
};

const styles = {
  imageButton: {
    borderStyle: "dashed" as const,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden" as const,
  },

  image: {
    padding: 10,
    position: "relative",
    zIndex: 10,
    borderRadius: 10,
  },

  imageDeleteBtn: {
    position: "absolute",
    top: "6%",
    right: "20%",
    zIndex: 999,
    backgroundColor: "white",
    borderRadius: 50,
  },
};

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (report: AddReportFormType, parentKey: string) => void;
  entityId?: string;
  propertyId?: string;
  unitId?: string;
  todoFormLoading?: boolean;
  isMaintenance?: boolean;
  defaultId: string;
  maintenanceId?: string;
}

interface PropertyType {
  title: string;
  nid: string;
}

export function ReportForm({
  loading,
  error,
  onSubmit,
  entityId,
  propertyId,
  unitId,
  todoFormLoading,
  isMaintenance,
  defaultId,
  maintenanceId
}: Props) {
  const { t } = useTranslation();

  const [imagesArray, setImagesArray] = useState<any>([]);

  const [entity, setEntity] = useState<string | undefined | null>(entityId);
  const [property, setProperty] = useState<string | undefined | null>(propertyId);
  const [unit, setUnit] = useState<string | undefined | null>(unitId);
  const [maintenance, setMaintenance] = useState<string | undefined | null>(maintenanceId);
  const [urgency, setUrgency] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState<string | null | undefined>(undefined);



  const [chooseImage, { data }] = useImagePicker(true);
  const { showActionSheetWithOptions } = useActionSheet();

  const hasUnitOrProperty = Boolean(unit || property);

  const queryById = useMaintenanceById({
    nid: unit! ? unit! : property!,
    object: unit ? 'unit' : 'property',
    enabled: hasUnitOrProperty
  });

  const allMaintenances = useMaintenances({
    enabled: !hasUnitOrProperty // The query runs only if hasUnitOrProperty is false
  });

  const { data: allEntities } = useEntities();


  const { data: allProperties } = usePropertiesByEntity({
    nid: entity?.toString(),
  });

  const { data: units } = useUnitsByProperty({
    nid: property?.toString(),
  });

  const { data: maintenances } = hasUnitOrProperty ? queryById : allMaintenances;

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        data.map((item) => {
          setImagesArray((prev: any) => [
            ...prev,
            {
              path: item.path,
              data: item.data,
            },
          ]);
        });
      } else {
        setImagesArray((prev: any) => [
          ...prev,
          {
            path: data.path,
            data: data.data,
          },
        ]);
      }
    }
  }, [data]);



  const [entityPick, setEntityPick] = useState<PickerItem[]>(createEntityPick(allEntities));
  const [propertyPick, setPropertyPick] = useState<PickerItem[]>(createPropertyPick(allProperties));
  const [unitPick, setUnitPick] = useState<PickerItem[]>(createUnitResponsePick(units));
  const [maintenancePick, setMaintenancePick] = useState<PickerItem[]>(createMaintenancePick(maintenances))

  const [propertyPickerError, setPropertyPickerError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setEntityPick(createEntityPick(allEntities));
  }, [allEntities]);

  useEffect(() => {
    setPropertyPick(createPropertyPick(allProperties));
  }, [allProperties]);

  useEffect(() => {
    setUnitPick(createUnitResponsePick(units));
  }, [units]);

  useEffect(() => {
    setMaintenancePick(createMaintenancePick(maintenances))
  }, [maintenances])

  const urgencies = {
    short: `${t("todo.list.urgency_types.short")}`,
    middle: `${t("todo.list.urgency_types.middle")}`,
    long: `${t("todo.list.urgency_types.long")}`,
    none: `${t("todo.list.urgency_types.no_urgency")}`,
    critical: `${t("todo.list.urgency_types.critical")}`
  };

  const statuses = {
    open: `${t("todo.list.status.open")}`,
    in_progress: `${t("todo.list.status.in_progress")}`,
    done: `${t("todo.list.status.done")}`,
  };

  const urgencyPick = useMemo(
    () =>
      Object.entries(urgencies ?? {}).map((value: any, index, array) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [urgencies]
  );

  const statusPick = useMemo(
    () =>
      Object.entries(statuses ?? {}).map((value: any, index, array) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [statuses]
  );

  const onSelectEntity = (item: string) => {
    setProperty(undefined);
    setUnit(undefined);
    setEntity(item);
  };

  const onSelectProperty = (item: string) => {
    setPropertyPickerError(undefined);
    setUnit(undefined);
    setProperty(item);
  };

  const onSelectUnit = (item: string) => {
    setPropertyPickerError(undefined);
    setUnit(item);
  };

  const onSelectMaintenance = (item: string) => {
    setPropertyPickerError(undefined);
    setMaintenance(item);
  }

  const onSelectUrgency = (item: string) => {
    setUrgency(item);
  };

  const onSelectStatus = (item: string) => {
    setStatus(item);
  };

  const onAddImage = () => {
    showActionSheetWithOptions(
      {
        options: ["Take a photo", "Choose from library", "Cancel"],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) {
          chooseImage(ImageSource.CAMERA);
        } else if (index === 1) {
          chooseImage(ImageSource.GALLERY);
        }
      }
    );
  };

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: AddReportForm;
    isValid: boolean;
  }) => {
    if (!property && !maintenance) {
      setPropertyPickerError('Choose a parent container');
      return;
    }

    if (!status) {
      return;
    }

    if (!urgency) {
      return;
    }

    let parentKey = "";
    if (maintenance) {
      parentKey = `todosbyMaintenance:${maintenance}`;
    } else if (unit) {
      parentKey = `todosbyUnit:${unit}`;
    } else if (property) {
      parentKey = `todosbyProperty:${property}`;
    }

    const form: AddReportFormType = {
      field_todo_assignment: maintenance ? maintenance : unit
        ? unit.toString()
        : property
          ? property.toString()
          : "",

      field_todo_description: {
        und: [
          {
            value: state.description,
          },
        ],
      },

      field_todo_short_desc: {
        und: [
          {
            value: state.short_description,
          },
        ],
      },

      field_todo_value: {
        und: [
          {
            value: state.costs.toString(),
          },
        ],
      },

      field_todo_status: {
        und: status!,
      },

      field_todo_priority: {
        und: urgency!,
      },

      field_todo_note: {
        und: [
          {
            value: state.note,
          },
        ],
      },

      field_todo_responsible: {
        und: [
          {
            value: state.service_provider,
          },
        ]
      },


      field_todo_pictures: imagesArray?.map((item: Image) => item.data),
    };


    if (isValid) {
      return onSubmit?.(form, parentKey);
    }
  };

  return (
    <>
      <Form<AddReportForm> onSubmit={onFormSubmit}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              {/* <Spinner visible={todoFormLoading}></Spinner> */}
              <Spacer size="small"></Spacer>
              {!isMaintenance && (
                <>
                  <Text bold textColor={COLOR_X.SECONDARY}>{t("main.entity")} *</Text>
                  <Spacer size="small"></Spacer>
                  <Picker
                    placeholder={`${t("todo.add.select_entity")}`}
                    value={entity ? entity : null}
                    items={entityPick}
                    onChange={(item) => onSelectEntity(item)}
                  />

                  <Spacer size="small"></Spacer>

                  <Text bold textColor={COLOR_X.SECONDARY}>{t("main.properties")} *</Text>
                  <Spacer size="small"></Spacer>
                  <Picker
                    placeholder={`${t("todo.add.select_property")}`}
                    value={property ? property : null}
                    items={propertyPick}
                    onChange={(item) => onSelectProperty(item)}
                    error={propertyPickerError}
                  />

                  <Spacer size="small"></Spacer>

                  <Text bold textColor={COLOR_X.SECONDARY}>{t("main.utilization_units")}</Text>
                  <Spacer size="small"></Spacer>

                  <Picker
                    placeholder={`${t("todo.add.select_unit")}`}
                    value={unit ? unit : null}
                    items={unitPick}
                    onChange={(item) => onSelectUnit(item)}
                  />

                  <Spacer size="small"></Spacer>

                  <Text bold textColor={COLOR_X.SECONDARY}>{t("main.maintenance")}</Text>
                  <Spacer size="small"></Spacer>
                  <Picker
                    placeholder={`${t("todo.add.select_maintenance")}`}
                    value={maintenance ? maintenance : null}
                    items={maintenancePick}
                    onChange={(item) => onSelectMaintenance(item)}
                  />
                </>
              )}

              <Spacer size="small"></Spacer>

              <IssueFormItem></IssueFormItem>
              <Spacer size="small"></Spacer>

              <ShortDescriptionFormItem></ShortDescriptionFormItem>
              <Spacer size="small"></Spacer>

              <CostsFormItem></CostsFormItem>

              <Spacer size="small"></Spacer>

              <Text bold textColor={COLOR_X.SECONDARY} style={{ marginBottom: 16 }}>{t("todo.list.urgency")} *</Text>

              <Picker
                placeholder={`${t("todo.add.choose_urgency")}`}
                items={urgencyPick}
                onChange={(item) => onSelectUrgency(item)}
                error={urgency == undefined ? `${t("validators.field")}` : undefined}
              />
              <Spacer size="small" />
              <Text bold textColor={COLOR_X.SECONDARY} style={{ marginBottom: 16 }}>Status *</Text>
              <Picker

                placeholder={`${t("todo.add.choose_status")}`}
                items={statusPick}
                onChange={(item) => onSelectStatus(item)}
                error={status == undefined ? `${t("validators.field")}` : undefined}
              />




              <Spacer size="normal"></Spacer>

              <Tappable onTap={onAddImage} style={styles.imageButton}>
                <Stack
                  fillHorizontal
                  backgroundColor={COLOR.DIVIDER}
                  padding={["normal"]}
                  alignMiddle
                  alignCenter
                  horizontal
                >
                  <CameraIcon color={COLOR.TERTIARY}></CameraIcon>
                  <Spacer size="small"></Spacer>
                  <Text textColor={COLOR.TERTIARY} alignCenter>
                    {t("main.take_photo")}
                  </Text>
                </Stack>
              </Tappable>
              <Spacer size="normal"></Spacer>
              {!!imagesArray.length && (
                <Stack alignCenter alignMiddle>
                  {imagesArray.map((value: Image) => {
                    return (
                      <Stack
                        width={"100%" as any}
                        alignMiddle
                        alignCenter
                        style={{ position: "relative" }}
                      >
                        <Spacer size="small" />

                        <Image
                          // borderRadius="large"
                          style={styles.image as StyleProp<ImageStyle>}
                          width={160}
                          height={160}
                          source={{ uri: value.path }}
                          key={value.path}
                        />
                        <Stack style={styles.imageDeleteBtn as ViewProps}>
                          <Tappable
                            onTap={() => {
                              setImagesArray(
                                imagesArray.filter((item: Image) => {
                                  return item.path !== value.path;
                                })
                              );
                            }}
                          >
                            <CloseCircleIcon
                              size={42}
                              color={COLOR.ERROR}
                            ></CloseCircleIcon>
                          </Tappable>
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              )}

              <NoteFormItem></NoteFormItem>

              <Spacer size="small"></Spacer>

              <ServiceProviderFormItem></ServiceProviderFormItem>

              <Spacer size="small" />

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={loading}
                loading={loading}
              >
                {t("todo.add.add_todo")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? <ErrorPopup error={error} title="Unable to add ToDo" /> : null}
    </>
  );
}
