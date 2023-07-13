import { Screen } from "@immotech-component/screen";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Dimensions, Linking, TouchableOpacity } from "react-native";
import { Text } from "@immotech-component/text";
import MapView, { Marker } from "react-native-maps";
import { Screens } from "../navigation/screens";
import { COLOR_X } from "../../../feature/theme/src/theme";

type MapParamList = {
  [Screens.MapScreen]: { lon?: string; lat?: string };
};

const screenHeight = Dimensions.get("window").height;


const MapComponent = () => {
  const { params } = useRoute<RouteProp<MapParamList>>();

  const { lon, lat } = params;

  if (!lon || !lat) {
    return null;
  }

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  }

  return (
    <Screen withSafeArea>

      <MapView
        style={{ flex: 1, minHeight: screenHeight - 300 }}
        initialRegion={{
          longitude: +lon! ?? 0,
          latitude: +lat! ?? 0,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        scrollEnabled={true}
        mapType="satellite"
      >
        <Marker
          coordinate={{
            latitude: +lat! ?? 0,
            longitude: +lon! ?? 0,
          }}
        />
      </MapView>
      <TouchableOpacity
        onPress={openNavigation}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#4673FF",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text textColor={COLOR_X.PRIMARY} bold>
          Google Maps
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};

const Map = React.memo(MapComponent);

export default Map;
