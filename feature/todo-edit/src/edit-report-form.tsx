import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { ServiceProviderFormItem } from "@immotech-feature/maintenance-form-items";
import { AddReportFormType, ToDoResponse } from "@immotech-feature/todo-api";
import { CostsFormItem, IssueFormItem, NoteFormItem, ShortDescriptionFormItem } from "@immotech-feature/todo-form-items";
import { t } from "i18next";
import { CameraIcon, CloseCircleIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo, useState } from "react";
import { ImageStyle, StyleProp, ViewProps } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export type EditReportForm = {
  description?: string;
  short_description?: string;
  costs: string;
  note?: string;
  service_provider?: string;
};

export type Image = {
  path: string;
  data: string;
  existed?: string;
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
  onSubmit?: (report: AddReportFormType, id?: string) => void;
  todoFormLoading?: boolean;
  todo?: ToDoResponse;
  onDeletePicture?: (pictureToDelete: {
    [key: string]: "delete";
  }) => Promise<any>;
}

export function EditReportForm({
  loading,
  error,
  onSubmit,
  onDeletePicture,
  todoFormLoading,
  todo,
}: Props) {
  const [imagesArray, setImagesArray] = useState<any>([]);
  const [urgency, setUrgency] = useState<string | undefined>(
    !Array.isArray(todo?.field_todo_priority)
      ? todo?.field_todo_priority?.und![0].value
      : undefined
  );
  const [status, setStatus] = useState<string | undefined>(
    !Array.isArray(todo?.field_todo_status)
      ? todo?.field_todo_status?.und![0].value
      : undefined
  );

  const [chooseImage, { data }] = useImagePicker(true);
  const { showActionSheetWithOptions } = useActionSheet();

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

  useEffect(() => {
    if (todo) {
      if (!Array.isArray(todo.field_todo_pictures)) {
        todo.field_todo_pictures.und.map((item: any) => {
          setImagesArray((prev: any) => [
            ...prev,
            {
              path: `https://immotech.cloud/system/files/${item.uri.replace(
                "private://",
                ""
              )}`,
              data: `https://immotech.cloud/system/files/${item.uri.replace(
                "private://",
                ""
              )}`,

              existed: true,
            },
          ]);
        });
      }
    }
  }, [todo]);

  const urgencies = {
    short: `${t("todo.list.urgency_types.short")}`,
    middle: `${t("todo.list.urgency_types.middle")}`,
    long: `${t("todo.list.urgency_types.long")}`,
    none: `${t("todo.list.urgency_types.no_urgency")}`,
  };

  const statuses = {
    open: `${t("todo.list.status.open")}`,
    in_progress: `${t("todo.list.status.in_progress")}`,
    done: `${t("todo.list.status.done")}`,
  };

  const urgencyPick = useMemo(
    () =>
      Object.entries(urgencies ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [urgencies]
  );

  const statusPick = useMemo(
    () =>
      Object.entries(statuses ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [statuses]
  );

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
    state: EditReportForm;
    isValid: boolean;
  }) => {
    const form: AddReportFormType = {
      field_todo_assignment: todo!.field_todo_assignment.und[0].target_id,

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
        und: status,
      },

      field_todo_priority: {
        und: urgency,
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
            value: state.service_provider
          }
        ]
      },

      field_todo_pictures: imagesArray
        .filter((image: Image) => !image.existed)
        .map((image: Image) => image.data),
    };
    if (form.field_todo_pictures!.length === 0) {
      delete form.field_todo_pictures;
    }

    if (isValid) {
      return onSubmit?.(form, todo?.nid);
    }
  };

  // imagesArray.map((image: Image) => {
  //   if (!image.existed) {
  //     return image.data;
  //   }
  // }) ?? [],
  // };

  const initialState = useMemo(
    () => ({
      nid: todo!.nid,

      description: !Array.isArray(todo!.field_todo_description)
        ? todo!.field_todo_description?.und![0].value
        : "",

      short_description: !Array.isArray(todo?.field_todo_short_desc)
        ? todo?.field_todo_short_desc?.und![0].value
        : "",

      costs: todo!.field_todo_value.und[0].value,

      note: !Array.isArray(todo?.field_todo_note)
        ? todo?.field_todo_note?.und![0].value
        : "",

      service_provider: !Array.isArray(todo?.field_todo_responsible) ? todo?.field_todo_responsible?.und?.[0]?.value : ""
    }),
    []
  );

  return (
    <>
      <Form<EditReportForm> onSubmit={onFormSubmit} state={initialState}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={todoFormLoading}></Spinner>
              <Spacer size="small"></Spacer>

              <IssueFormItem></IssueFormItem>
              <Spacer size="small"></Spacer>

              <ShortDescriptionFormItem></ShortDescriptionFormItem>
              <Spacer size="small"></Spacer>

              <CostsFormItem></CostsFormItem>

              <Spacer size="small"></Spacer>

              <Text>{t("todo.list.urgency")}</Text>
              <Spacer size="small"></Spacer>

              <Picker
                placeholder={`${t("todo.add.choose_urgency")}...`}
                value={urgency}
                items={urgencyPick}
                onChange={(item) => onSelectUrgency(item)}
              />

              <Spacer size="small"></Spacer>

              <Text>Status</Text>
              <Spacer size="small"></Spacer>

              <Picker
                placeholder={`${t("todo.add.choose_status")}...`}
                value={status}
                items={statusPick}
                onChange={(item) => onSelectStatus(item)}
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
                <Stack>
                  {imagesArray.map((image: Image, index: number) => {
                    return (
                      <Stack
                        width={"100%" as any}
                        alignMiddle
                        alignCenter
                        style={{ position: "relative" }}
                      >
                        <Spacer size="small" />
                        <Image
                          style={styles.image as StyleProp<ImageStyle>}
                          width={200}
                          height={200}
                          source={{
                            uri: image.path,
                          }}
                          key={image.path}
                        />
                        <Stack style={styles.imageDeleteBtn as ViewProps}>
                          <Tappable
                            onTap={() => {
                              setImagesArray(
                                imagesArray.filter((item: Image) => {
                                  return item.path !== image.path;
                                })
                              );

                              if (image.existed) {
                                onDeletePicture!({
                                  [`${index}`]: "delete",
                                });
                              }
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

              {/* {!Array.isArray(todo?.field_todo_pictures) &&
                todo?.field_todo_pictures?.und?.map(
                  (picture: any, index: number) => (
                    <Stack>
                      <Stack
                        width={"100%"}
                        alignMiddle
                        alignCenter
                        style={{ position: "relative" }}
                      >
                        <Spacer size="small" />
                        <Image
                          style={styles.image as StyleProp<ImageStyle>}
                          width={200}
                          height={200}
                          source={{
                            headers: {
                              "Content-Security-Policy":
                                "img-src 'self' https://immotech.cloud",
                            },
                            uri: `https://immotech.cloud/system/files/${picture.uri.replace(
                              "private://",
                              ""
                            )}`,
                          }}
                        />
                        <Stack style={styles.imageDeleteBtn as ViewProps}>
                          <Tappable
                            onTap={() => {
                              return onDeletePicture!({
                                [`${index}`]: "delete",
                              });
                            }}
                          >
                            <CloseCircleIcon
                              size={42}
                              color={COLOR.ERROR}
                            ></CloseCircleIcon>
                          </Tappable>
                        </Stack>
                      </Stack>
                    </Stack>
                  )
                )} */}

              <NoteFormItem></NoteFormItem>

              <Spacer size="small"></Spacer>

              <ServiceProviderFormItem />

              <Spacer size="small" />

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={loading}
                loading={loading}
              >
                {t("edit.todo")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? (
        <ErrorPopup error={error} title={`${t("main.unable_add")}`} />
      ) : null}
    </>
  );
}
