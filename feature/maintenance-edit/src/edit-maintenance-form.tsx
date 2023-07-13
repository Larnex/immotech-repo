import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Text } from "@immotech-component/text";
import { BuildDateFormItem, LocationFormItem, ManufacturFormItem, NameFormItem, ServiceProviderFormItem } from "@immotech-feature/maintenance-form-items";
import { AmountFormItem } from "@immotech-feature/maintenance-form-items/src/amount-form-item";
import { SubTypeFormItem } from "@immotech-feature/maintenance-form-items/src/subtype-form-item";
import { NotesForm } from "@immotech-feature/todo-form-items";
import { t } from "i18next";
import { CameraIcon, CloseCircleIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo, useState } from "react";
import { ImageStyle, StyleProp, ViewProps } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { ErrorPopup } from "../../../component/error-popup/src/error-popup";
import type { EditMaintenanceForm } from "../../maintenance-api/src/use-maintenance";
import { MaintenanceFormType, MaintenanceResponse } from "../../maintenance-api/src/use-maintenance";
import type { Image as ImageType } from "../../todo-add/src/report-form";
import { styles } from "./styles";


const TODAY = new Date();

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (report: MaintenanceFormType) => void;
  entityId?: string;
  propertyId?: string;
  unitId?: string;
  types?: any;
  loadingForm?: boolean;
  maintenance: MaintenanceResponse;
  maintenanceFormLoading?: boolean;
  onDeletePicture?: (pictureToDelete: {
    [key: string]: "delete";
  }) => Promise<any>;
}

interface Note {
  title?: string;
  text?: string;
  id?: string;
}

export function EditMaintenanceForm({
  loading,
  error,
  onSubmit,
  types,
  maintenance,
  maintenanceFormLoading,
  onDeletePicture,
}: Props) {

  const [type, setType] = useState<string>(
    maintenance?.field_buildingservice_type.und[0].tid
  );

  const [notes, setNotes] = useState<Note[]>(maintenance.field_buildingservice_notes?.und! ?? []);
  const handleTitleChange = (index: number, title: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index].title = title;
    setNotes(updatedNotes);
  };

  const handleTextChange = (index: number, text: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index].text = text;
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    setNotes([...notes, { title: '', text: '' }]);
  };

  const handleRemoveNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const [open, setOpen] = useState(false);

  const [imagesArray, setImagesArray] = useState<any>([]);

  const [chooseImage, { data }] = useImagePicker(true);

  const { showActionSheetWithOptions } = useActionSheet();

  const createInitiateStateForRadioButtons = () => [
    {
      id: '1',
      label: 'TGA',
      value: 'mep',
      selected: true
    },
    {
      id: '2',
      label: 'Wartung',
      value: 'maintenance',
      selected: false
    }
  ];

  const [maintenanceTypeRadioButton, setMaintenanceTypeRadioButton] = useState<RadioButtonProps[]>(createInitiateStateForRadioButtons());

  const [showAmount, setShowAmount] = useState<boolean>(false);

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

  const typePick = useMemo(
    () =>
      Object.entries(types ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [type]
  );

  useEffect(() => {
    if (maintenance) {
      if (!Array.isArray(maintenance!.field_buildingservice_pictures! && maintenance!.field_buildingservice_pictures!)) {
        maintenance.field_buildingservice_pictures.und.map((item: any) => {
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
  }, [maintenance]);

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
    state: EditMaintenanceForm;
    isValid: boolean;
  }) => {
    const form: MaintenanceFormType = {
      field_buildingservice_assignment:
        maintenance!.field_buildingservice_assignment.und[0].target_id,

      field_buildingservice_type: {
        und: [type],
      },

      field_buildingservice_name: {
        und: [
          {
            value: state.name,
          },
        ],
      },

      field_buildingservice_manufactur: {
        und: [
          {
            value: state.manufactur,
          },
        ],
      },

      field_buildingservice_multi: {
        und: [
          {
            value: showAmount ? "1" : "0",
          }
        ]
      },

      field_buildingservice_base: {
        // get selected radio button value
        und: maintenanceTypeRadioButton.find((item) => item.selected)!.value
      },

      field_buildingservice_subtype: {
        und: [
          {
            value: state.subtype
          }
        ]
      },

      field_buildingservice_number: {
        und: [
          {
            value: state.amount
          }
        ]
      },

      field_buildingservice_notes: notes.length > 0 ? {
        und: notes.map(note => ({
          field_fbn_title: {
            und: [
              {
                value: note.title
              }
            ]
          },

          field_fbn_text: {
            und: [
              {
                value: note.text
              }
            ]
          }
        }))
      } : [],

      field_buildingservice_location: {
        und: [
          {
            value: state.location,
          },
        ],
      },

      field_buildingservice_responsibl: {
        und: [
          {
            value: state.service_provider
          }
        ]
      },

      field_buildingservice_build_date: {
        und: [
          {
            value: {
              date: state.buildDate
                ? `${state.buildDate.getMonth()}.${state.buildDate.getFullYear()}`
                : `${TODAY.getMonth()}.${TODAY.getFullYear()}`,
            },
          },
        ],
      },

      field_buildingservice_pictures: imagesArray
        .filter((image: ImageType) => !image.existed)
        .map((image: ImageType) => image.data),
    };

    if (form.field_buildingservice_pictures!.length === 0) {
      delete form.field_buildingservice_pictures;
    }
    if (isValid) {
      return onSubmit?.(form);
    }
  };

  const initialState = useMemo(
    () => ({
      name: !Array.isArray(maintenance!.field_buildingservice_name)
        ? maintenance!.field_buildingservice_name?.und![0].value
        : "",

      manufactur: !Array.isArray(maintenance!.field_buildingservice_manufactur)
        ? maintenance!.field_buildingservice_manufactur?.und![0].value
        : "",

      location: !Array.isArray(maintenance!.field_buildingservice_location)
        ? maintenance!.field_buildingservice_location?.und![0].value
        : "",

      // buildDate: !Array.isArray(maintenance!.field_buildingservice_build_date)
      //   ? new Date(
      //     maintenance!.field_buildingservice_build_date?.und![0].value!.date!
      //   )
      //   : new Date(),

      subtype: !Array.isArray(maintenance!.field_buildingservice_subtype)
        ? maintenance!.field_buildingservice_subtype?.und![0].value
        : "",

      amount: !Array.isArray(maintenance!.field_buildingservice_number)
        ? maintenance!.field_buildingservice_number?.und![0].value
        : "",

      service_provider: !Array.isArray(maintenance!.field_buildingservice_responsibl) ? maintenance!.field_buildingservice_responsibl?.und?.[0]?.value : ""

    }),
    []
  );

  return (
    <>
      <Form<EditMaintenanceForm> onSubmit={onFormSubmit} state={initialState}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={loading}></Spinner>

              <Spacer size="small"></Spacer>

              <NameFormItem ></NameFormItem>

              <Spacer size="small"></Spacer>

              <Stack>
                <RadioGroup radioButtons={maintenanceTypeRadioButton} onPress={(radioButtons: RadioButtonProps[]) => {
                  setMaintenanceTypeRadioButton(radioButtons);
                }} layout='row' containerStyle={{
                  justifyContent: 'center',
                }} />
              </Stack>

              <Spacer size="small"></Spacer>

              <Text textColor={COLOR.SECONDARY}>{t("tga.type")}</Text>

              <Spacer size="small" />

              <DropDownPicker
                open={open}
                value={type}
                items={typePick}
                setValue={setType}
                setOpen={setOpen}
                searchable={true}
                textStyle={{ fontSize: 16, color: COLOR.SECONDARY }}
                placeholder={`${t("todo.add.select_type")}`}
                placeholderStyle={{ fontSize: 18, color: "#aaa" }}
                maxHeight={300}
                listMode="MODAL"
                style={{
                  borderColor: "#4673FF",
                  backgroundColor: "#fff",
                }}
                labelStyle={{
                  fontSize: 16,
                  color: "#4673FF",
                  paddingHorizontal: 10,
                }}
                listItemLabelStyle={{
                  fontSize: 16,
                  color: "#4673FF",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#4673FF",
                  borderRadius: 8,
                }}
                listItemContainerStyle={{
                  marginVertical: 4,
                  marginHorizontal: 8,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}
                customItemContainerStyle={{
                  backgroundColor: "#e6f0ff",
                }}

                customItemLabelStyle={{
                  color: "#3058d6",

                }}
                searchContainerStyle={{
                  borderBottomColor: "transparent"

                }}
                searchTextInputStyle={{
                  paddingHorizontal: 10,
                  borderColor: "transparent"
                }}
                modalProps={{
                  animationType: "slide",
                }}
              />

              <Spacer size="small" />

              <Spacer size="small" />

              <SubTypeFormItem />

              <Spacer size="small"></Spacer>

              {/* check if radio button is mep */}
              {maintenanceTypeRadioButton[0].selected && (
                <Stack>
                  <BouncyCheckbox
                    size={25}
                    text="Mehrfache TGA"
                    fillColor="#222e5c"
                    style={{
                      justifyContent: "center"
                    }}
                    textStyle={{ textDecorationLine: "none", color: "#7899D4" }}
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "red" }}
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={(isChecked: boolean) => { setShowAmount(isChecked) }}
                  />
                  {showAmount && (
                    <>
                      <AmountFormItem></AmountFormItem>
                    </>
                  )}
                </Stack>
              )}

              <Spacer size="small"></Spacer>

              <BuildDateFormItem></BuildDateFormItem>

              <Spacer size="small"></Spacer>

              <NotesForm notes={notes} addNote={handleAddNote} removeNote={handleRemoveNote} titleChange={handleTitleChange} textChange={handleTextChange} />

              <ManufacturFormItem></ManufacturFormItem>

              <Spacer size="small"></Spacer>

              <LocationFormItem></LocationFormItem>

              <Spacer size="small"></Spacer>

              <ServiceProviderFormItem></ServiceProviderFormItem>

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
                  {imagesArray.map((value: ImageType) => {
                    return (
                      <Stack
                        width={"100%" as any}
                        alignMiddle
                        alignCenter
                        style={{ position: "relative" }}
                      >
                        <Spacer size="small" />

                        <Image
                          borderRadius="large"
                          style={styles.image as StyleProp<ImageStyle>}
                          width={200}
                          height={200}
                          source={{ uri: value.path }}
                          key={value.path}
                        />
                        <Stack style={styles.imageDeleteBtn as ViewProps}>
                          <Tappable
                            onTap={() => {
                              setImagesArray(
                                imagesArray.filter((item: ImageType) => {
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

              <Spacer size="small"></Spacer>

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={loading}
                loading={loading}
              >
                {t("tga.add_new")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? (
        <ErrorPopup error={error} title="Unable to add maintenance" />
      ) : null}
    </>
  );
}
