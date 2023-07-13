import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyAyYmS4goD7wCLp7jf1FUYcCpCCMVc_Mxw');

type coords = {
  latitude: number;
  longitude: number;
};

const requestPermission = async () => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('whenInUse');
    // Geolocation.setRNConfiguration({
    //   skipPermissionRequests: false,
    //   authorizationLevel: 'whenInUse',
    // });
  }

  if (Platform.OS === 'android') {
    return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  }
};

let config = {
  // enableHighAccuracy: true,
  timeout: 30000,
  maximumAge: 3600000,
};
export const getCoords = async (callback: (coords: coords) => void) => {
  let status;

  await requestPermission().then(granted => {
    if (granted) {
      status = true;
    }
  });

  if (status) {
    return Geolocation.getCurrentPosition(
      data => {
        const { coords } = data;

        callback(coords);
      },
      error => {
        console.error(error);
      },
      config,
    );
  }
};

export const geocodeCity = async (city: string): Promise<coords | null> => {
  try {
    const response = await Geocoder.from(city);
    if (response.results.length > 0) {
      const { lat, lng } = response.results[0].geometry.location;

      return { latitude: lat, longitude: lng };
    }
  } catch (error) {
    console.error('geocodeCity error:', error);
    return null;
  }

  return null;
};

export const fetchMapSnapshot = async (city: string) => {
  
  const coordinates = await geocodeCity(city);

  if (!coordinates) {
    console.error(`Failed to geocode city: ${city}`);
    return null;
  }

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.latitude},${coordinates.longitude}&zoom=13&size=200x200&maptype=roadmap&markers=color:blue%7C${coordinates.latitude},${coordinates.longitude}&key=AIzaSyAyYmS4goD7wCLp7jf1FUYcCpCCMVc_Mxw`;

  return staticMapUrl;
};
