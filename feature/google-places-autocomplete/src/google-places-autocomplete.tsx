import React, { useEffect } from "react";

import { FormItem, isEmpty } from "@immotech-component/form";
import { TextInput } from "@immotech-component/text-input";
import { ScrollView } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

import { useTranslation } from "react-i18next";
import { Dimensions, KeyboardAvoidingView, Platform, View } from "react-native";
import { Text } from "../../../component/text/src/text";
import { COLOR_X } from "../../theme/src/theme";
import { COLOR } from "native-x-theme";
const width = Dimensions.get("window").width;

interface Props {
  address: string;
  getInputLocation?: (
    building: string,
    street: string,
    city: string,
    postalCode: string,
    address: string
  ) => void;
}

export const GooglePlacesInput = ({ address, getInputLocation }: Props) => {
  const { i18n, t } = useTranslation();

  // const validators = [isEmpty(t("validators.address"))]

  const [location, setLocation] = React.useState("");


  useEffect(() => {
    setLocation(address);
  }, [address]);

  useEffect(() => {
    const requestPermissions = async () => {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
        title: "Tinie",
        message: "Grant Tinie Access to Location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }).then((result) => {
        if (result == RESULTS.GRANTED) {

        } else {

        }
      });
    };

    requestPermissions();
  }, []);

  return (
    <>
      <FormItem name="address">
        <ScrollView horizontal={true} keyboardShouldPersistTaps="always">
          <GooglePlacesAutocomplete
            keyboardShouldPersistTaps="always"
            ref={(ref) => ref?.setAddressText(location)}
            listViewDisplayed={false}
            numberOfLines={2}
            keepResultsAfterBlur={true}
            placeholder=""
            onPress={(data, details = null) => {
              getInputLocation!(
                details!.address_components
                  .filter((item: any) => item.types.includes("street_number"))
                  .map((item) => item.long_name)[0] as string,
                details!.address_components
                  .filter((item: any) => item.types.includes("route"))
                  .map((item) => item.long_name)[0] as string,
                details!.address_components
                  .filter((item: any) => item.types.includes("locality"))
                  .map((item) => item.long_name)[0] as string,
                details!.address_components
                  .filter((item: any) => item.types.includes("postal_code"))
                  .map((item) => item.long_name)[0] as string,
                data.description
              );
              setLocation(data.description);
            }}
            fetchDetails
            query={{
              key: "AIzaSyAyYmS4goD7wCLp7jf1FUYcCpCCMVc_Mxw",
              language: i18n.language,
            }}
            styles={{
              textInput: {
                width: width - 64,
                color: "#000",
                textShadowColor: "#000",
                borderWidth: 0,
                padding: 0,
              },
              textInputContainer: {
                width: width - 64,
                borderWidth: 0,
              },

            }}
            textInputProps={{
              InputComp: TextInput,
              onChangeText: (text) => {
                setLocation(text);
              },
              backgroundColor: COLOR.DIVIDER,
              borderColor: COLOR_X.SECONDARY,
              width: width - 64
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
          />
        </ScrollView>
      </FormItem>
      {location.trim() === '' && <Text textColor={COLOR.ERROR}>{t("validators.address")}</Text>}
    </>
  );
};


