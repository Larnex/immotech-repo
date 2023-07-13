import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { usePropertyTypes } from "@immotech-feature/property-api";
import { TitleFormItem } from "@immotech-feature/property-form-items";
import { UnitInputType } from "@immotech-feature/unit-api";
import { getCoords } from "@immotech/util";
import { t } from "i18next";
import { LocationIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo } from "react";
import Geocoder from "react-native-geocoding";
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

export type EditUnitParams = Pick<
  UnitInputType,
  | "title"
  | "field_utilization_unit_assign"
  | "field_utilization_unit_typ"
  | "field_utilization_unit_address"
>;

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (property: EditUnitParams) => Promise<any>;
  unit?: UnitInputType;
}

export function EditUnitForm({ loading, error, onSubmit, unit }: Props) {
  const [propertyId, setPropertyId] = React.useState(
    unit?.field_utilization_unit_assign!.und[0].target_id
  );

  const { data: types } = usePropertyTypes();

  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [building, setBuilding] = React.useState("");

  const [type, setType] = React.useState<number>(
    unit?.field_utilization_unit_typ!.und[0].tid
  );

  const [address, setAddress] = React.useState("");

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

  const onSelect = (item: number) => {
    setType(item);
  };

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
    if (unit) {
      Geocoder.from(
        unit?.field_utilization_unit_geofield!.und[0].lat,
        unit?.field_utilization_unit_geofield!.und[0].lon
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
  }, [unit]);

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: any;
    isValid: boolean;
  }) => {
    state = {
      title: state.title,

      field_utilization_unit_assign: propertyId!.toString(),

      field_utilization_unit_typ: {
        und: [type?.toString()],
      },

      field_utilization_unit_address: {
        und: [
          {
            thoroughfare: state.street ? state.street : `${street} ${building}`,
            postal_code: state.postalcode ? state.postalcode : postalCode,
            locality: state.city ? state.city : city,
          },
        ],
      },
    };

    if (isValid) {
      return onSubmit?.(state);
    }
  };

  const initialState = React.useMemo(
    () => ({
      title: unit?.title,

      field_utilization_unit_assign: {
        und: [
          {
            target_id: unit?.field_utilization_unit_assign.und[0].target_id,
          },
        ],
      },

      field_utilization_unit_address: {
        und: [
          {
            thoroughfare:
              unit?.field_utilization_unit_address?.und[0].thoroughfare,
            postal_code:
              unit?.field_utilization_unit_address?.und[0].postal_code,
            locality: unit?.field_utilization_unit_address?.und[0].locality,
          },
        ],
      },
    }),
    []
  );

  return (
    <>
      <Form<EditUnitParams> onSubmit={onFormSubmit} state={initialState}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <TitleFormItem />
              <Spacer size="small" />
              {/* <PropertyTypeFormItem /> */}
              <Stack fillHorizontal>
                <Text>{t("properties_details.type")}</Text>
                <Spacer size="x-small" />
                <Picker
                  value={type}
                  placeholder={`${t("properties_details.select_type")}...`}
                  items={categories}
                  onChange={(item) => onSelect(item)}
                />
              </Stack>
              <Spacer size="small" />

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
                disabled={loading}
                loading={loading}
              >
                {t("edit.unit")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? <ErrorPopup error={error} title="Unable to add entity" /> : null}
    </>
  );
}
