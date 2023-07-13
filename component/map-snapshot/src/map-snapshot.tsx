import React from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { geocodeCity } from '@immotech/util';
import { ViewStyle } from "react-native";
import { Image } from "react-native";

interface MapSnapshotProps {
    city?: string;
    style?: ViewStyle;
    // lat?: string;
    // lon?: string
}

export const MapSnapshotComponent: React.FC<MapSnapshotProps> = ({ city, style }) => {
    const mapViewRef = React.useRef<MapView>(null);
    const [mapImageUri, setMapImageUri] = React.useState<string | null>(null);


    const [region, setRegion] = React.useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const capture = async () => {
        const snapshot = await mapViewRef.current?.takeSnapshot({
            width: 200, // Set the width of the image
            height: 200, // Set the height of the image
            format: 'png', // Set the image format
            quality: 0.8, // Set the image quality (0.0 to 1.0)
            result: 'file', // Set the result type (use 'base64' for base64 encoded image)
        });
        setMapImageUri(snapshot!);
    };

    React.useEffect(() => {
        if (region.latitude && region.longitude) {
            capture();
        }
    }, [region]);

    React.useEffect(() => {
        const fetchCoordinates = async () => {
            if (city) {
                const coordinates = await geocodeCity(city!);

                if (coordinates) {
                    setRegion({
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    });
                }
            }
        };

        fetchCoordinates();
    }, [city]);

    return (
        <>
            {mapImageUri ? (
                <Image
                    source={{ uri: mapImageUri }}
                    style={[{ width: '100%', height: '100%' }, style]}
                />
            ) : (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={[{ width: '100%', height: '100%' }, style]}
                    region={region}
                    cacheEnabled
                    loadingEnabled
                    zoomEnabled={false}
                    scrollEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    toolbarEnabled={false}
                    ref={mapViewRef}
                />
            )}
        </>
    );
};

export const MapSnapshot = React.memo(MapSnapshotComponent)

