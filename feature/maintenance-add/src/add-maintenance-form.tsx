import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { useEntities } from "@immotech-feature/entity-api";
import { MaintenanceFormType } from "@immotech-feature/maintenance-api";
import { BuildDateFormItem, LocationFormItem, ManufacturFormItem, NameFormItem } from "@immotech-feature/maintenance-form-items";
import { AmountFormItem } from "@immotech-feature/maintenance-form-items/src/amount-form-item";
import { SubTypeFormItem } from "@immotech-feature/maintenance-form-items/src/subtype-form-item";
import { usePropertiesByEntity } from "@immotech-feature/property-api";
import { NotesForm } from "@immotech-feature/todo-form-items/src/notes-form";
import { useUnitsByProperty } from "@immotech-feature/unit-api";
import { CameraIcon, CloseCircleIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageStyle, StyleProp, ViewProps } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import {
  createEntityPick,
  createPropertyPick,
  createUnitResponsePick
} from './add-maintenance-form-utils';

import { PickerItem } from "@immotech/util";
import { COLOR_X } from "../../theme/src/theme";
import { ServiceProviderFormItem } from "@immotech-feature/maintenance-form-items/src/service-provider-form-item";


type AddMaintenanceForm = {
  title_note?: string;
  amount?: string;
  subtype?: string;
  buildDate?: Date;
  location?: string;
  manufactur?: string;
  note?: string;
  name: string;
  service_provider?: string;
}


export type Image = {
  path: string;
  data: string;
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
  typesLoading?: boolean;
  internalID?: string;
}
interface Note {
  title: string;
  text: string;
}

export function AddMaintenanceForm({
  loading,
  error,
  onSubmit,
  entityId,
  propertyId,
  unitId,
  types,
  loadingForm,
  typesLoading,
  internalID
}: Props) {
  const initialNotes: Note[] = [];

  const { t } = useTranslation();

  const { data: allEntities } = useEntities();

  const [open, setOpen] = useState(false);

  const [notes, setNotes] = useState(initialNotes);
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

  const [type, setType] = useState<string | undefined>(undefined);

  const [imagesArray, setImagesArray] = useState<any>([]);

  const [entity, setEntity] = useState<string | undefined | null>(entityId);
  const [property, setProperty] = useState<string | undefined | null>(propertyId);
  const [unit, setUnit] = useState<string | undefined | null>(unitId);

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


  const { data: allProperties } = usePropertiesByEntity({
    nid: entity?.toString(),
  });


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

  const { data: units } = useUnitsByProperty({
    nid: property?.toString(),
    internalID: internalID
  });

  const [maintenanceType, setMaintenanceType] = useState(createInitiateStateForRadioButtons());
  const [entityPick, setEntityPick] = useState<PickerItem[]>(createEntityPick(allEntities));
  const [propertyPick, setPropertyPick] = useState<PickerItem[]>(createPropertyPick(allProperties));
  const [unitPick, setUnitPick] = useState<PickerItem[]>(createUnitResponsePick(units));

  const [propertyPickerError, setPropertyPickerError] = useState<string | undefined>(undefined);
  const [typePickerError, setTypePickerError] = useState<string | undefined>(undefined);



  useEffect(() => {
    setEntityPick(createEntityPick(allEntities));
  }, [allEntities]);

  useEffect(() => {
    setPropertyPick(createPropertyPick(allProperties));
  }, [allProperties]);

  useEffect(() => {
    setUnitPick(createUnitResponsePick(units));
  }, [units]);

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

  const onSelectTypePicker = (item: string) => {
    setType(item);
    setTypePickerError(undefined);
  }



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
    state: AddMaintenanceForm;
    isValid: boolean;
  }) => {

    if (!property) {
      setPropertyPickerError('Choose a parent container');

      return;
    }

    if (!type) {
      setTypePickerError('Type is required');

      return;
    }


    const form: MaintenanceFormType = {
      field_buildingservice_assignment: unit
        ? unit.toString()
        : property
          ? property.toString()
          : "",

      field_buildingservice_type: {
        und: [type],
      },

      field_buildingservice_multi: {
        und: [
          {
            value: showAmount ? "1" : "0",
          }
        ]
      },

      field_buildingservice_subtype: {
        und: [
          {
            value: state.subtype
          }
        ]
      },

      field_buildingservice_base: {
        // get selected radio button value
        und: maintenanceTypeRadioButton.find((item) => item.selected)!.value!
      },

      field_buildingservice_number: {
        und: [
          {
            value: state.amount
          }
        ]
      },

      field_buildingservice_name: {
        und: [
          {
            value: state.name,
          },
        ],
      },

      field_buildingservice_notes: notes.length > 0
        ? {
          und: notes.map((note) => ({
            field_fbn_title: {
              und: [
                {
                  value: note.title,
                },
              ],
            },
            field_fbn_text: {
              und: [
                {
                  value: note.text,
                },
              ],
            },
          })),
        }
        : [],


      field_buildingservice_manufactur: {
        und: [
          {
            value: state.manufactur,
          },
        ],
      },

      field_buildingservice_location: {
        und: [
          {
            value: state.location,
          },
        ],
      },

      field_buildingservice_build_date: {
        und: [
          {
            value: {
              date: state.buildDate
                ? `${state.buildDate.getMonth()}.${state.buildDate.getFullYear()}`
                : `${TODAY.getMonth()}.${TODAY.getFullYear()}`
            },
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
      field_buildingservice_pictures: imagesArray?.map(
        (item: Image) => item.data
      ),
    };


    if (isValid) {
      return onSubmit?.(form);
    }
  };

  return (
    <>
      <Form<AddMaintenanceForm> onSubmit={onFormSubmit}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={loadingForm}></Spinner>
              <Spacer size="small"></Spacer>
              <Text bold textColor={COLOR_X.SECONDARY}>{t("main.entities")} *</Text>
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

              <NameFormItem />

              <Spacer size="small"></Spacer>

              <Text textColor={COLOR.SECONDARY} bold>{t("tga.type")} *</Text>

              <Spacer size="small" />

              <DropDownPicker
                open={open}
                value={type}
                items={typePick}
                setValue={setType}
                setOpen={setOpen}
                searchable={true}
                placeholder={`${t("todo.add.select_type")}`}
                placeholderStyle={{ fontSize: 16, color: "#aaa" }}
                maxHeight={300}
                listMode="MODAL"
                // containerStyle={{ height: 40 }}
                onChangeValue={(item: any) => onSelectTypePicker(item)}
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

              <SubTypeFormItem />

              <Spacer size="small" />

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

              <NotesForm notes={notes} addNote={handleAddNote} removeNote={handleRemoveNote} titleChange={handleTitleChange} textChange={handleTextChange}></NotesForm>

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
                  {imagesArray.map((value: Image, index: number) => {
                    return (
                      <Stack
                        key={index}
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

      {typePickerError && (
        <ErrorPopup error={typePickerError} title={`${t("validators.type")}`} />
      )}
    </>
  );
}
