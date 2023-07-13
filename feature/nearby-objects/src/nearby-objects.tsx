import { Text } from '@immotech-component/text';
import { PropertyListResponse, getAllProperties } from '@immotech-feature/property-api';
import { COLOR_X } from '@immotech-feature/theme';
import { Screens } from '@immotech/screens';
import { calculateDistance, getCoords, useCombinedState } from '@immotech/util';
import { useNavigation } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import ClosestMarker from "../../../component/assets/locator.png";

type Region = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
};

type State = {
    region: Region | null,
    markers: PropertyListResponse[],
    closestMarker: PropertyListResponse | null,
    fullScreen: boolean,
    selectedMarkerData: PropertyListResponse | null,
    selectedMarkerPosition: { latitude: number, longitude: number } | null,
};


export function NearbyObjectsComponent() {
    const { navigate } = useNavigation<any>();

    const { data } = getAllProperties();

    const [state, setState] = useCombinedState<State>({
        region: null,
        markers: [],
        closestMarker: null,
        fullScreen: false,
        selectedMarkerData: null,
        selectedMarkerPosition: null,
    });

    const memoizedData = React.useMemo(() => data, [data]);

    const onMarkerSelect = React.useCallback((markerData) => {
        const { nid, id, lat, lon, parent_id, title } = markerData;

        navigate(Screens.PropertyDetails, {
            id: nid, internalID: id, object: 'property', lat, lon, parentId: parent_id, title
        });
    }, [navigate]);


    useEffect(() => {
        getCoords((coords: any) => {
            const { latitude, longitude } = coords;
            const newRegion: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };


            let closestMarkerData = null;
            let closestDistance = Number.MAX_VALUE;

            memoizedData?.forEach(marker => {
                const lat = parseFloat(marker.lat!);
                const lon = parseFloat(marker.lon!);

                if (isNaN(lat) || isNaN(lon)) {
                    return;
                }

                const distance = +calculateDistance(latitude, longitude, lat, lon, true);

                if (distance < closestDistance) {
                    closestMarkerData = marker;
                    closestDistance = distance;
                }
            });
            setState({ region: newRegion, closestMarker: closestMarkerData });
        })
    }, []);


    const onMarkerPress = React.useCallback((e, marker) => {
        setState({ selectedMarkerData: marker, selectedMarkerPosition: e.nativeEvent.coordinate });
    }, []);

    return (
        <Stack fill style={state.fullScreen ? { ...StyleSheet.absoluteFillObject, position: 'absolute', top: 0, height: "100%" } : styles.container}>

            {!state.fullScreen && (
                <Stack>
                    <Text style={styles.title} textColor={COLOR_X.BLACK}>Nearby Objects</Text>
                </Stack>
            )}
            <Stack fill style={!state.fullScreen ? { height: 250 } : { height: "100%" }} >

                <MapView style={state.fullScreen ? styles.fullSizeMap : styles.map} scrollEnabled={true} mapType="satellite"
                    region={state.region ? state.region : undefined}
                    initialRegion={state.region ? state.region : undefined}
                    showsUserLocation
                >

                    {memoizedData?.map((marker, index) => {
                        const lat = parseFloat(marker.lat!);
                        const lon = parseFloat(marker.lon!);

                        if (isNaN(lat) || isNaN(lon)) {
                            return null;
                        }

                        const isClosest = state.closestMarker && state.closestMarker.nid === marker.nid;
                        return (

                            <Marker
                                key={marker.id ?? marker.nid}
                                coordinate={{ latitude: +marker.lat!, longitude: +marker.lon! }}
                                onPress={(e) => {
                                    onMarkerPress(e, marker);
                                }}

                            >
                                {isClosest &&
                                    <View style={{ flex: 1 }}>
                                        <Image source={ClosestMarker} style={{ resizeMode: 'contain', width: 32, height: 32 }} />
                                    </View>
                                }
                                <Callout
                                    onPress={() => {
                                        onMarkerSelect(marker);
                                    }}
                                    tooltip
                                    style={styles.calloutContainer}
                                >
                                    <View style={styles.calloutView}>
                                        <Text alignCenter style={styles.calloutTitle}>{marker.title}</Text>
                                        <Text alignCenter style={styles.calloutDescription}>
                                            {`${marker.city}, ${marker.street}, ${marker.zip_code}`}
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>

                        )
                    })}

                </MapView>


            </Stack>
        </Stack >
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,

    },
    fullScreenContainer: {
        flex: 1,
        height: 900

    },
    calloutContainer: {
        minWidth: 300,
    },
    calloutView: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        borderColor: '#cccccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flex: 1,
        elevation: 5,
    },
    calloutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    calloutDescription: {
        fontSize: 16,
        color: '#666666',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        height: 250,
    },
    fullSizeMap: {
        ...StyleSheet.absoluteFillObject,
        height: "100%",
    },
    title: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: "800"
    },
    resizeButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 8,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    pinText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 3,
    },
});

export const NearbyObjects = React.memo(NearbyObjectsComponent);
