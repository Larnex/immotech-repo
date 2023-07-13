import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { useEntities } from "@immotech-feature/entity-api";
import { createEntityPick } from "@immotech-feature/maintenance-add/src/add-maintenance-form-utils";
import { PropertyInputType, useAttributes, usePropertyTypes } from "@immotech-feature/property-api";
import { BuildingFormItem, CityFormItem, IdFormItem, PostalCodeFormItem, StreetFormItem, TitleFormItem } from "@immotech-feature/property-form-items";
import { getCoords } from "@immotech/util";
import { useNetInfo } from "@react-native-community/netinfo";
import { CameraIcon, LocationIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Geocoder from "react-native-geocoding";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { GooglePlacesInput } from "../../google-places-autocomplete/src";
import { COLOR_X } from "../../theme/src/theme";
import { AttributesForm } from "./attribute-form";

const styles = {
  imageButton: {
    borderStyle: "dashed" as const,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden" as const,
  },

  locationButton: {
    borderColor: "transparent",
    borderWidth: 1,
    overflow: "hidden" as const,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
};

export type AddPropertyParams = Pick<
  PropertyInputType,
  | "title"
  | "field_property_id"
  | "field_property_accounting_entity"
  | "field_property_address"
  | "field_property_overview_picture"
  | "field_build_attributes"
>;

interface Props {
  loading?: boolean;
  error?: Error | null;
  entityId?: string;
  onSubmit?: (property: AddPropertyParams) => void;
  propertyFormLoading?: boolean;
}

interface Attribute {
  attribute?: string;
  value?: string;
}

export function AddPropertyForm({
  loading,
  error,
  onSubmit,
  entityId,
  propertyFormLoading,
}: Props) {
  const netInfo = useNetInfo();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const initialAttributes: Attribute[] = [];

  const [chooseImage, { data }]: any = useImagePicker();

  const { data: types } = usePropertyTypes();

  const { data: attributesList } = useAttributes();

  const { data: allEntities } = useEntities();

  const [validationError, setValidationError] = React.useState<string | undefined>(undefined);
  const [entity, setEntity] = React.useState<string | undefined | null>(entityId!);

  const [entityPick, setEntityPick] = React.useState(createEntityPick(allEntities));
  const [entityPickerError, setEntityPickerError] = React.useState<string | undefined>(undefined);


  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [building, setBuilding] = React.useState("");

  const [type, setType] = React.useState<string | undefined>(undefined);
  const [dropDownPickerError, setDropDownPickerError] = React.useState<string | undefined>(undefined);

  const [address, setAddress] = React.useState("");
  const { showActionSheetWithOptions } = useActionSheet();

  const [attributes, setAttributes] = React.useState(initialAttributes)
  const handleAttributeChange = (attribute: string, index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].attribute = attribute;
    setAttributes(updatedAttributes);
  };

  const handleAttributeValueChange = (index: number, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].value = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { attribute: '', value: '' }]);
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  }


  const onSelectEntity = (item: string) => {
    setEntity(item);
    setEntityPickerError(undefined);
  };

  const onSelectTypePickerItem = (item: string) => {
    setType(item);
    setDropDownPickerError(undefined);
  }


  const getInputLocation = (
    building: string,
    street: string,
    city: string,
    postalCode: string,
    address: string
  ) => {
    setBuilding(building);
    setStreet(street);
    setCity(city);
    setPostalCode(postalCode);
    setAddress(address);
  };
  const onAddImage = () => {
    showActionSheetWithOptions(
      {
        options: ["Take a photo", "Choose from library", "Cancel"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          chooseImage(ImageSource.CAMERA);
        } else if (buttonIndex === 1) {
          chooseImage(ImageSource.GALLERY);
        }
      }
    );
  };

  const categories = useMemo(
    () =>
      Object.entries(types ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [types]
  );
  const onAddLocation = () => {
    getCoords((coords) => {
      const { latitude, longitude } = coords;

      Geocoder.from(latitude, longitude).then((json) => {
        setAddress(json.results[0].formatted_address);

        setPostalCode(json.results[0].address_components[6].long_name);
        setCity(json.results[0].address_components[2].long_name);
        setBuilding(json.results[0].address_components[0].long_name);
        setStreet(json.results[0].address_components[1].long_name);
        setCountry(json.results[0].address_components[5].long_name);
        setRegion(json.results[0].address_components[4].long_name);
      });
    });
  };

  React.useEffect(() => {
    setEntityPick(createEntityPick(allEntities));
  }, [allEntities]);

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: any;
    isValid: boolean;
  }) => {

    if (!entity && !entityId) {
      setEntityPickerError(`${t("validators.container")}`);
      return;
    }

    if (!type) {
      setDropDownPickerError(`${t("validators.type")}`);
      return;
    }

    if (!state.street && !street) {
      setValidationError(`${t("validators.street")}`);
      return;
    }

    if (!state.building && !building) {
      setValidationError(`${t("validators.building")}`)
      return;
    }

    if (!state.postal_code && !postalCode) {
      setValidationError(`${t("validators.postal_code")}`);
      return;
    }



    state = {
      title: state.title,
      field_property_id: {
        und: [
          {
            value: state.nid,
          },
        ],
      },

      field_property_accounting_entity: entity ? entity.toString() : entityId,

      field_property_type: {
        und: [type?.toString()],
      },



      field_property_address: {
        und: [
          {
            thoroughfare: state.street ? `${state.street} ${state.building}` : `${street} ${building}`,
            postal_code: state.postal_code ? state.postal_code : postalCode,
            locality: state.city ? state.city : city,
          },
        ],
      },
      field_property_overview_picture: data?.data,

      field_build_attributes: attributes.length > 0
        ? {
          und: attributes.map((attribute) => ({
            field_build_attributes_value: {
              und: [
                {
                  value: attribute.value,
                },
              ],
            },
            field_build_attributes_attribute: {
              und: [
                attribute.attribute,
              ],
            },
          })),
        }
        : [],
    };


    if (isValid) {
      return onSubmit?.(state);
    }
  };

  // TODO: DELETE THIS
  const initialState = React.useMemo(
    () => ({
      title: 'Rendering test',
      nid: "rendering test",
      street: 'Mazowiecka',
      building: '19D',
      city: "Sopot",
      postalCode: "81-862",
      type: "1"
    }),
    [],
  );


  return (
    <>
      <Form<AddPropertyParams> onSubmit={onFormSubmit}>
        {({ submitForm }) => {
          return (
            <Stack fill>

              <Spinner visible={propertyFormLoading}></Spinner>
              <Spacer size="small"></Spacer>
              <Text textColor={COLOR_X.SECONDARY} bold>{t("main.entities")} *</Text>
              <Spacer size="small"></Spacer>

              <Picker
                placeholder={`${t("todo.add.select_entity")}`}
                value={entity ? entity : undefined}
                items={entityPick}
                onChange={(item) => onSelectEntity(item)}
                error={entityPickerError}
              />

              <Spacer size="small"></Spacer>
              <IdFormItem />
              <Spacer size="small" />
              <TitleFormItem />
              <Spacer size="small" />
              <Stack fillHorizontal>
                <Text textColor={COLOR_X.SECONDARY} bold>{t("properties_details.type")} *</Text>
                <Spacer size="small" />

                <DropDownPicker
                  open={open}
                  value={type}
                  items={categories}
                  setValue={setType}
                  setOpen={setOpen}
                  searchable={true}
                  placeholder={`${t("properties_details.type")}`}
                  placeholderStyle={{ fontSize: 16, color: "#aaa" }}
                  maxHeight={300}
                  listMode="MODAL"
                  onChangeValue={(item) => onSelectTypePickerItem(item)}
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
              </Stack>
              <Spacer size="small" />
              <Text textColor={COLOR_X.SECONDARY} bold>{t("properties_details.photo")}</Text>
              <Spacer size="small" />
              <Tappable onTap={onAddImage} style={styles.imageButton}>
                <Stack
                  fillHorizontal
                  backgroundColor={COLOR.DIVIDER}
                  padding={["normal"]}
                  alignMiddle
                  alignCenter
                  horizontal
                >
                  <CameraIcon color={COLOR.TERTIARY} />
                  <Spacer size="small" />
                  <Text textColor={COLOR.TERTIARY} alignCenter>
                    {t("main.take_photo")}
                  </Text>
                </Stack>
              </Tappable>
              <Spacer size="small" />
              {data?.path ? (
                <Stack width={"100%" as any} alignMiddle alignCenter>
                  <Spacer size="small" />
                  <Image
                    width={160}
                    height={160}
                    // borderRadius={"large"}
                    source={{ uri: data?.path }}
                  />
                </Stack>
              ) : null}
              <Spacer size="small" />
              <Text textColor={COLOR_X.SECONDARY} bold>{t("properties_details.address")} *</Text>
              <Spacer size="small" />
              {netInfo.isConnected !== false ? (
                <>
                  <Tappable onTap={onAddLocation} style={styles.locationButton}>
                    <Stack
                      backgroundColor={COLOR.ACCENT}
                      alignCenter
                      paddingVertical={8}
                      paddingHorizontal={16}
                      style={{ borderRadius: 25 }}
                    >
                      <LocationIcon color={COLOR.INPUT} />
                      <Spacer size="x-small" />
                      <Text textColor={COLOR.INPUT} alignCenter>
                        {t("main.fill_gps")}
                      </Text>
                    </Stack>
                  </Tappable>
                  <Spacer size="small" />
                  <GooglePlacesInput
                    address={address}
                    getInputLocation={getInputLocation}
                  />
                  <Spacer size="small" />
                </>
              ) : (
                <Stack>
                  <StreetFormItem />
                  <Spacer size="small" />
                  <BuildingFormItem />
                  <Spacer size="small" />
                  <CityFormItem />
                  <Spacer size="small" />
                  <PostalCodeFormItem />
                  <Spacer size="small" />
                </Stack>
              )}


              <AttributesForm attributes={attributes} attributesList={attributesList} removeAttribute={handleRemoveAttribute} addAttribute={handleAddAttribute} attributeChange={handleAttributeChange} attributeValueChange={handleAttributeValueChange} />

              <Spacer size="small" />

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={() => submitForm()}
                disabled={loading}
                loading={loading}
              >
                {t("properties_list.add_new")}
              </Button>
            </Stack>
          );
        }}

      </Form>
      {error ? (
        <ErrorPopup error={error} title={`${t("main.unable_add")}`} />
      ) : null}

      {dropDownPickerError && (
        <ErrorPopup error={dropDownPickerError} title={`${t("properties_details.select_type")}`} />
      )}

      {entityPickerError && (
        <ErrorPopup error={entityPickerError} />
      )}

      {validationError && (
        <ErrorPopup error={validationError} />
      )}
    </>
  );
}
