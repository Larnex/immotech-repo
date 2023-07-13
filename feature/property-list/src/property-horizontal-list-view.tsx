import { styles } from "@immotech-component/horizontal-lists-styles";
import { Text } from '@immotech-component/text';
import { PropertyListResponse, getAllProperties } from '@immotech-feature/property-api';
import { Stack } from 'native-x-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import PlaceholderImage from '../.././../component/assets/default-building.4e26911c4ea17f38f4e8.jpg';
import { COLOR_X } from '../../theme/src/theme';
import FastImage from "react-native-fast-image";

interface Props {
    // properties: PropertyListResponse[];
    error?: Error | null;
    // loading?: boolean;
    showFullList?: () => void;
    onSelect?: (id: string, internalID: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
}


export function PropertyHorizontalListView({ error, showFullList, onSelect }: Props) {
    const { data: properties, isLoading: loading } = getAllProperties();



    const { t } = useTranslation();

    return (
        <Stack paddingRight={16}>
            <Stack style={styles.header} justifyBetween paddingLeft={16}>
                <Stack alignMiddle>
                    <Text textColor={COLOR_X.PLACEHOLDER_TEXT} style={styles.sideText}>{t("properties_list.nearby")}</Text>
                </Stack>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => showFullList!()}>
                    <Text style={styles.seeAllText} textColor={COLOR_X.OMNY_PURPLE}>{t("main.see_all")}</Text>
                </TouchableOpacity>
            </Stack>
            <Spinner visible={loading} />
            <FlatList
                data={properties}
                keyExtractor={(property) => property?.nid + property.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                initialNumToRender={1}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => { onSelect && onSelect(item?.nid, item?.id, "property", item?.lat, item?.lon, item?.parent_id, item?.title) }}>
                        <Stack style={styles.itemImageContainer}>
                            <FastImage source={item.image ? { uri: item.image, priority: FastImage.priority.normal } : PlaceholderImage} style={styles.itemImage} />

                            <Stack style={styles.overlayContainer}>
                                {!!item.unitsAmount && (
                                    <Text style={styles.overlayText}>
                                        {item.unitsAmount}{" "}
                                        {item.unitsAmount === 1 ? t("main.utilization_unit") : t("main.utilization_units")}
                                    </Text>
                                )}
                                {!!item.maintenancesAmount && (
                                    <Text style={styles.overlayText}>
                                        {item.maintenancesAmount} {t("main.maintenance")}
                                    </Text>
                                )}
                                {!!item.todosAmount && (
                                    <Text style={styles.overlayText}>
                                        {item.todosAmount}{" "}
                                        {item.todosAmount === 1 ? "ToDo" : "ToDo's"}
                                    </Text>
                                )}
                            </Stack>
                        </Stack>
                        <Stack style={styles.itemDetails} horizontal fillHorizontal justifyBetween>
                            <Stack>
                                <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail" bold textColor={COLOR_X.SECONDARY}>{item.title}</Text>
                                <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">ID: {item.id}</Text>
                                <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">{item.type}</Text>

                                <Text style={styles.itemDescription} alignLeft>{item.city}, {item.zip_code}. {item.distance} {t("properties_list.from_me")}</Text>
                            </Stack>

                        </Stack>
                    </TouchableOpacity>
                )}
            />
            {/* {!!error && (<><Spacer size="normal" /> <ErrorMessage>{error}</ErrorMessage></>)} */}
        </Stack>
    );
};
