import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Text } from "@immotech-component/text";
import {
  PropertyDataType,
  PropertyInputType,
  usePropertyTypes
} from "@immotech-feature/property-api";
import { IdFormItem, TitleFormItem } from "@immotech-feature/property-form-items";
import { getCoords } from "@immotech/util";
import { t } from "i18next";
import { CameraIcon, LocationIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Geocoder from "react-native-geocoding";
import Spinner from "react-native-loading-spinner-overlay";
import { GooglePlacesInput } from "../../google-places-autocomplete/src";


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
    borderRadius: 16,
    overflow: "hidden" as const,
  },
  image: {
    width: 200,
    height: 200,
    padding: 10,
    position: "relative",
    zIndex: 10,
    borderRadius: 10,
  },
};

export type EditPropertyParams = Pick<
  PropertyInputType,
  | "title"
  | "field_property_id"
  | "field_property_accounting_entity"
  | "field_property_address"
  | "field_property_overview_picture"
>;

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (property: EditPropertyParams, id?: string) => void;
  property?: PropertyDataType;
  editPropertyFormLoading?: boolean;
}

export function EditPropertyForm({
  loading,
  onSubmit,
  property,
  editPropertyFormLoading,
  error,
}: Props) {
  const [entityId, setEntityId] = React.useState(
    property && property?.field_property_accounting_entity?.und?.[0]?.target_id!
  );
  const [open, setOpen] = React.useState(false);

  const [chooseImage, { data }] = useImagePicker();
  const { data: types } = usePropertyTypes();

  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [building, setBuilding] = React.useState("");

  const [type, setType] = React.useState<number>(
    property?.field_property_type!.und[0].tid
  );

  const [address, setAddress] = React.useState("");

  const { showActionSheetWithOptions } = useActionSheet();

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

  const getInputLocation = (
    building: string,
    street: string,
    city: string,
    postalCode: string,
    address: string
  ) => {
    setAddress(address);
    setBuilding(building);
    setStreet(street);
    setCity(city);
    setPostalCode(postalCode);
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
      Geocoder.from(coords.latitude, coords.longitude).then((json) => {
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

  useEffect(() => {
    if (property) {
      Geocoder.from(
        property?.field_property_geofield!.und[0].lat,
        property?.field_property_geofield!.und[0].lon
      ).then((json) => {
        setAddress(json.results[0].formatted_address);

        setPostalCode(json.results[0].address_components[6].long_name);
        setCity(json.results[0].address_components[2].long_name);
        setBuilding(json.results[0].address_components[0].long_name);
        setStreet(json.results[0].address_components[1].long_name);
        setCountry(json.results[0].address_components[5].long_name);
        setRegion(json.results[0].address_components[4].long_name);
      });
    }
  }, [property]);

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: any;
    isValid: boolean;
  }) => {
    state = {
      title: state.title,
      field_property_id: {
        und: [
          {
            value: state.nid,
          },
        ],
      },

      field_property_accounting_entity: entityId?.toString(),

      field_property_type: {
        und: [type?.toString()],
      },

      field_property_address: {
        und: [
          {
            thoroughfare: state.street ? state.street : `${street} ${building}`,
            postal_code: state.postalcode ? state.postalcode : postalCode,
            locality: state.city ? state.city : city,
          },
        ],
      },
      field_property_overview_picture: data && data!.data,
    };

    if (isValid) {
      return onSubmit?.(state, property?.nid);
    }
  };

  const initialState = React.useMemo(
    () => ({
      title: property?.title,
      nid: property?.field_property_id?.und[0].value,
      field_property_id: {
        und: [{
          value: property?.field_property_id?.und?.[0]?.value
        }
        ]
      },

      field_property_accounting_entity:
        property?.field_property_accounting_entity,

      field_property_address: {
        und: [
          {
            thoroughfare: property?.field_property_address?.und[0].thoroughfare,
            postal_code: property?.field_property_address?.und[0].postal_code,
            locality: property?.field_property_address?.und[0].locality,
          },
        ],
      },
      // field_property_overview_picture:
      //   property?.field_property_overview_picture!.und[0].filename,
    }),
    []
  );

  return (
    <>
      <Form<EditPropertyParams> onSubmit={onFormSubmit} state={initialState}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={editPropertyFormLoading}></Spinner>
              <IdFormItem />
              <Spacer size="small" />
              <TitleFormItem />
              <Spacer size="small" />
              {/* <PropertyTypeFormItem /> */}
              <Stack fillHorizontal>
                <Text>{t("properties_details.type")}</Text>
                <Spacer size="x-small" />

                <DropDownPicker
                  open={open}
                  value={type}
                  items={categories}
                  setValue={setType}
                  setOpen={setOpen}
                  searchable={true}
                  textStyle={{ fontSize: 16, color: COLOR.SECONDARY }}
                  placeholder={`${t("properties_details.select_type")}`}
                  placeholderStyle={{ fontSize: 16, color: "#aaa" }}
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
              </Stack>
              <Spacer size="small" />
              <Text>{t("properties_details.photo")}</Text>
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
                <Stack width={"100%"} alignMiddle alignCenter>
                  <Spacer size="small" />
                  <Image
                    style={styles.image as StyleProp<ImageStyle>}
                    source={{
                      uri: data?.path,
                    }}
                  />
                </Stack>
              ) : (
                <Stack
                  width={"100%"}
                  alignMiddle
                  alignCenter
                  style={{ position: "relative" }}
                >
                  <Spacer size="small" />
                  {property?.field_property_overview_picture! && property?.field_property_overview_picture.und && (
                    <Image
                      style={styles.image as StyleProp<ImageStyle>}
                      source={{
                        headers: {
                          "Content-Security-Policy":
                            "img-src 'self' https://immotech.cloud",
                        },
                        uri: `https://immotech.cloud/system/files/${property?.field_property_overview_picture!.und[0]
                          .filename
                          }`,
                      }}
                    />
                  )}
                </Stack>
              )}

              <Spacer size="small" />
              <Text>{t("properties_details.address")}</Text>
              <Spacer size="small" />
              <Tappable onTap={onAddLocation} style={styles.locationButton}>
                <Stack
                  fillHorizontal
                  backgroundColor={COLOR.ACCENT}
                  padding={["normal"]}
                  alignMiddle
                  alignCenter
                  horizontal
                >
                  <LocationIcon color={COLOR.INPUT} />
                  <Spacer size="small" />
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

              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={false}
              >
                {t("edit.property")}
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
