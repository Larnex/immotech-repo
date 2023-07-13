import React from 'react'
import { Stack } from 'native-x-stack';
import { Text } from '@immotech-component/text';
import { COLOR_X } from '@immotech-feature/theme';
import { TouchableOpacity, TouchableWithoutFeedback, Image, StyleSheet, FlatList, Animated } from 'react-native';
import { Entity } from '@immotech-feature/entity-api';
import PlaceholderImage from '../../assets/default-building.4e26911c4ea17f38f4e8.jpg';
import { PropertyListResponse } from '@immotech-feature/property-api';
import { useTranslation } from "react-i18next";
import { MapSnapshot } from '@immotech-component/map-snapshot';
import { formatDistance } from '@immotech/util';

interface Props {
    data: Entity[] | PropertyListResponse[] | [];
    entities?: boolean;
    properties?: boolean;
    onSelectProperty?: (id: string, internalID: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
    onSelectEntity?: (id: string, internalID: string, title?: string) => void;
}

export default function GridList({ data, onSelectEntity, onSelectProperty, entities, properties }: Props) {
    const { t } = useTranslation();

    const animatedValue = new Animated.Value(200);

    const animatedStyle = {
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                }),
            },
        ],
    };
    Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
    }).start();

    const renderItem = ({ item }: { item: Entity[] | PropertyListResponse[] }) => {


        const renderEntity = (entity: Entity) => (
            <TouchableOpacity
                onPress={() => onSelectEntity && onSelectEntity(entity?.nid!, entity?.id, entity?.title)}
                key={entity.id}
                activeOpacity={0.8}
                style={styles.cardContainerGrid}
            >
                <Animated.View style={[animatedStyle]}>
                    <Stack style={styles.itemContainerGrid}>
                        {/* <MapSnapshot city={entity.city!} style={styles.itemImageGrid} />
                         */}

                        <Image source={entity.image ? { uri: entity.image } : PlaceholderImage} style={styles.itemImageGrid} />

                        <Stack style={styles.itemDetailsGrid}>
                            <Text
                                style={styles.itemTitleGrid}
                                textColor={COLOR_X.SECONDARY}
                                bold
                            >
                                {entity.title}
                            </Text>
                            <Text
                                style={styles.itemTitleGrid}
                                textColor={COLOR_X.SECONDARY}
                            >
                                ID: {entity.id}
                            </Text>
                            <Stack style={styles.itemLocationGrid}>
                                <Text style={styles.itemLocationTextGrid} textColor={COLOR_X.PLACEHOLDER_TEXT}>{entity.city}, {entity.zip_code}</Text>
                            </Stack>
                            {!!entity.propertiesAmount && (
                                <Text style={styles.itemPropertiesGrid}>
                                    {entity.propertiesAmount}{" "}
                                    {entity.propertiesAmount === 1 ? "property" : "properties"}
                                </Text>
                            )}
                        </Stack>
                    </Stack>
                </Animated.View>
            </TouchableOpacity>
        );

        const renderProperties = (property: PropertyListResponse) => (
            <TouchableOpacity
                onPress={() => onSelectProperty && onSelectProperty(property?.nid, property?.id, 'property', property?.lat, property?.lon, property?.parent_id, property?.title)}
                key={property.id}
                activeOpacity={0.8}
                style={styles.cardContainerGrid}
            >
                <Animated.View style={[animatedStyle]}>
                    <Stack style={styles.itemContainerGrid}>
                        <Image source={property.image ? { uri: property.image } : PlaceholderImage} style={styles.itemImageGrid} />

                        <Stack style={styles.overlayContainer}>
                            {!!property.unitsAmount && (
                                <Text style={styles.overlayText}>
                                    {property.unitsAmount}{" "}
                                    {property.unitsAmount === 1 ? t("main.utilization_unit") : t("main.utilization_units")}
                                </Text>
                            )}
                            {!!property.maintenancesAmount && (
                                <Text style={styles.overlayText}>
                                    {property.maintenancesAmount} {t("main.maintenance")}
                                </Text>
                            )}
                            {!!property.todosAmount && (
                                <Text style={styles.overlayText}>
                                    {property.todosAmount}{" "}
                                    {property.todosAmount === 1 ? "ToDo" : "ToDo's"}
                                </Text>
                            )}
                        </Stack>
                        <Stack style={styles.itemDetailsGrid}>
                            <Text
                                style={styles.itemTitleGrid}
                                textColor={COLOR_X.SECONDARY}
                                numberOfLines={1}
                                bold
                            >
                                {property.title}
                            </Text>
                            <Text
                                style={styles.itemTitleGrid}
                                textColor={COLOR_X.SECONDARY}
                                numberOfLines={1}
                            >
                                ID: {property.id}
                            </Text>
                            {/* {property.propertiesAmount && (
                                <Text style={styles.itemPropertiesGrid}>
                                    {property.propertiesAmount}{" "}
                                    {property.propertiesAmount === 1 ? "property" : "properties"}
                                </Text>
                            )} */}
                            <Stack style={styles.itemLocationGrid}>
                                <Text style={styles.itemLocationTextGrid} textColor={COLOR_X.PLACEHOLDER_TEXT} numberOfLines={2}>{property.city}, {property.street}, {property.zip_code}</Text>
                                {/* <Text style={styles.itemLocationTextGrid} textColor={COLOR_X.PLACEHOLDER_TEXT} numberOfLines={1}>{formatDistance(property?.distance)} {t("properties_list.from_me")}</Text> */}

                            </Stack>
                        </Stack>
                    </Stack>
                </Animated.View>
            </TouchableOpacity>
        );

        return (
            <Stack style={styles.rowContainer}>
                {item.map((data) => {
                    if (entities) {
                        return (
                            <Stack style={styles.columnContainer} key={data.id}>

                                {renderEntity(data as Entity)}
                            </Stack>
                        )

                    } else if (properties) {
                        return (
                            <Stack style={styles.columnContainer} key={data.id}>

                                {renderProperties(data as PropertyListResponse)}
                            </Stack>
                        )
                    }
                })}
            </Stack>
        );
    };

    const groupedData = (data: any[] | null | undefined = []) => {

        return data!.reduce((accumulator: any[][], currentValue: any, currentIndex: number) => {
            if (currentIndex % 2 === 0) {
                accumulator.push([currentValue]);
            } else {
                accumulator[accumulator.length - 1].push(currentValue);
            }
            return accumulator;
        }, [])
    };



    return (
        <FlatList
            data={groupedData(data)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 8,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    columnContainer: {
        width: "48%",
    },
    cardContainerGrid: {
        backgroundColor: "#fff",
        borderRadius: 4,
        borderWidth: 0,
        elevation: 0,
        overflow: "hidden",
        marginBottom: 8,
    },
    itemContainerGrid: {
        flexDirection: "column",
        // alignItems: "center",
    },
    itemPropertiesGrid: {
        color: "#fff",
    },
    itemImageGrid: {
        width: "100%",
        height: 125,
        resizeMode: "cover",
    },

    itemLocationGrid: {

    },
    itemLocationTextGrid: {

    },
    itemDetailsGrid: {
    },

    itemTitleGrid: {
        fontSize: 16,
    },

    overlayContainer: {
        position: 'absolute',
        top: 5,
        left: 5,
    },
    overlayText: {
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        marginBottom: 4,
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
})