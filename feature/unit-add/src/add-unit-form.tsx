import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { useEntities } from "@immotech-feature/entity-api";
import { IdFormItem } from "@immotech-feature/entity-form-items";
import { createEntityPick, createPropertyPick, createTypePick } from "@immotech-feature/maintenance-add/src/add-maintenance-form-utils";
import { usePropertiesByEntity } from "@immotech-feature/property-api";
import { BuildingFormItem, CityFormItem, PostalCodeFormItem, StreetFormItem, TitleFormItem } from "@immotech-feature/property-form-items";
import { UnitInputFormType } from "@immotech-feature/unit-api";
import { getCoords } from "@immotech/util";
import { useNetInfo } from "@react-native-community/netinfo";
import { LocationIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Geocoder from "react-native-geocoding";
import Spinner from "react-native-loading-spinner-overlay";
import { GooglePlacesInput } from "../../google-places-autocomplete/src";
import { COLOR_X } from "../../theme/src/theme";

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

export type AddUnitParams = Pick<
  UnitInputFormType,
  | "title"
  | "field_utilization_unit_id"
  | "field_utilization_unit_assign"
  | "field_utilization_unit_address"
  | "field_utilization_unit_typ"
>;

interface Props {
  loading?: boolean;
  error?: Error | null;
  entityId?: string | null;
  propertyId?: string | null;
  onSubmit?: (unit: AddUnitParams) => void;
  types?: any;
  unitFormLoading?: boolean;
}

export function AddUnitForm({
  loading,
  error,
  onSubmit,
  propertyId,
  types,
  unitFormLoading,
  entityId,
}: Props) {
  const netInfo = useNetInfo();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const { data: allEntities } = useEntities();

  const [validationError, setValidationError] = React.useState<string | undefined>(undefined);
  const [entity, setEntity] = React.useState<string | undefined | null>(entityId);
  const [property, setProperty] = React.useState<string | undefined | null>(propertyId);
  const [propertyPickerError, setPropertyPickerError] = React.useState<string | undefined>(undefined);


  const { data: allProperties } = usePropertiesByEntity({
    nid: entity!,
  });
  React.useEffect(() => {
    setEntityPick(createEntityPick(allEntities));
  }, [allEntities]);

  React.useEffect(() => {
    setPropertyPick(createPropertyPick(allProperties));
    setPropertyPickerError(undefined);
  }, [allProperties]);

  const [defaultEntityId, setDefaultEntityId] = React.useState<string | undefined>(
    entityId!
  );

  const [defaultPropertyId, setDefaultPropertyId] = React.useState<
    string | undefined
  >(propertyId ?? undefined);
  const [entityPick, setEntityPick] = React.useState(createEntityPick(allEntities));
  const [propertyPick, setPropertyPick] = React.useState(createPropertyPick(allProperties));
  const [typePick, setTypePick] = React.useState(createTypePick(types));
  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [building, setBuilding] = React.useState("");

  const [type, setType] = React.useState<string | null | undefined>(undefined);
  const [typeError, setTypeError] = React.useState<string | undefined>(undefined);

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

  // const categories = useMemo(
  //   () =>
  //     Object.entries(types ?? {}).map((value: any) => {
  //       return {
  //         label: value[1],
  //         value: value[0],
  //       };
  //     }),
  //   [types]
  // );

  const onSelectEntity = (item: string) => {
    setDefaultEntityId(undefined);
    setDefaultPropertyId(undefined);
    setEntity(item);
  };

  const onSelectProperty = (item: string) => {
    setDefaultPropertyId(undefined);
    setProperty(item);
  };

  const onSelect = (item: string) => {
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
        // setCountry(json.results[0].address_components[5].long_name);
        // setRegion(json.results[0].address_components[4].long_name);
      });
    });
  };

  const onFormSubmit = async ({
    state,
    isValid,
  }: {
    state: any;
    isValid: boolean;
  }) => {

    if (!defaultPropertyId && !property) {
      setPropertyPickerError('Property is required!');
      return;
    }

    if (!type) {
      setTypeError('Type is required!');
      return;
    }

    if (!state.street && !street) {
      setValidationError(`${t("validators.street")}`);
      return;

    }

    if (!state.building && !building) {
      setValidationError(`${t("validators.building")}`);
      return;

    }

    if (!state.postal_code && !postalCode) {
      setValidationError(`${t("validators.postal_code")}`);
      return;
    }

    state = {

      title: state.title,
      field_utilization_unit_assign: property
        ? property.toString() : propertyId,

      field_utilization_unit_id: {
        und: [{
          value: state.nid
        }]
      },

      field_utilization_unit_typ: {
        und: [type?.toString()],
      },

      field_utilization_unit_address: {
        und: [
          {
            thoroughfare: state.street ? `${state.street} ${state.building}` : `${street} ${building}`,
            postal_code: state.postal_code ? state.postal_code : postalCode,
            locality: state.city ? state.city : city,
          },
        ],
      },
      // field_property_overview_picture: data?.base64,
    };


    if (isValid) {
      return onSubmit?.(state);
    }
  };

  return (
    <>
      <Form<AddUnitParams> onSubmit={onFormSubmit}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spinner visible={unitFormLoading}></Spinner>
              <Text textColor={COLOR_X.SECONDARY} bold>{t("main.entities")} *</Text>
              <Spacer size="small"></Spacer>
              <Picker
                placeholder={`${t("todo.add.select_entity")}`}
                value={defaultEntityId}
                items={entityPick}
                onChange={(item) => onSelectEntity(item)}
              />

              <Spacer size="small"></Spacer>

              <Text textColor={COLOR_X.SECONDARY} bold>{t("main.properties")} *</Text>
              <Spacer size="small"></Spacer>

              <Picker
                placeholder={`${t("todo.add.select_property")}`}
                value={defaultPropertyId}
                items={propertyPick}
                onChange={(item) => onSelectProperty(item)}
                error={propertyPickerError}
              />

              <Spacer size="small"></Spacer>

              <Stack fillHorizontal>
                <Text textColor={COLOR_X.SECONDARY} bold>{t("properties_details.type")} *</Text>
                <Spacer size="small" />

                <DropDownPicker
                  open={open}
                  value={type}
                  items={typePick}
                  setValue={setType}
                  setOpen={setOpen}
                  searchable={true}
                  placeholder={`${t("properties_details.type")}`}
                  placeholderStyle={{ fontSize: 16, color: "#aaa" }}
                  maxHeight={300}
                  listMode="MODAL"
                  onChangeValue={(item: any) => onSelect(item)}
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



              <Spacer size="small"></Spacer>
              <IdFormItem />
              <Spacer size="small"></Spacer>
              <TitleFormItem />




              <Spacer size="small" />
              <Text bold textColor={COLOR_X.SECONDARY}>{t("properties_details.address")} *</Text>
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


              <Button
                rounded={false}
                fontSize="normal"
                height={52}
                onTap={submitForm}
                disabled={loading}
                loading={loading}
              >
                {t("unit.add_new")}
              </Button>
            </Stack>
          );
        }}
      </Form>
      {error ? (
        <ErrorPopup error={error} title={`${t("main.unable_add")}`} />
      ) : null}

      {propertyPickerError && (
        <ErrorPopup error={propertyPickerError} />
      )}

      {validationError && (
        <ErrorPopup error={validationError} />
      )}
    </>
  );
}
