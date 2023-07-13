import { FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Stack } from 'native-x-stack';
import { Text } from '@immotech-component/text';
import PlaceholderImage from '../.././../component/assets/default-building.4e26911c4ea17f38f4e8.jpg';
import Spinner from 'react-native-loading-spinner-overlay';
import { ErrorMessage } from '@immotech-component/data-view/src/error-message';
import { MaintenanceListResponse, useMaintenances } from '@immotech-feature/maintenance-api';
import { useTranslation } from 'react-i18next';
import { Spacer } from 'native-x-spacer';
import { COLOR_X } from '../../theme/src/theme';
import { styles } from "@immotech-component/horizontal-lists-styles";

interface Props {
    showFullList?: () => void;
    onSelect?: (id: string, internalID?: string, assignedEntity?: string, type?: string) => void;
}

export function MaintenanceHorizontalListViewComponent({ showFullList, onSelect }: Props) {


    const { data: maintenance, isLoading: loading, error } = useMaintenances();

    const { t } = useTranslation();

    return (
        <Stack paddingRight={16}>
            <Stack style={[styles.header, { justifyContent: "flex-end" }] as any}>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => showFullList!()}>
                    <Text style={styles.seeAllText} textColor={COLOR_X.OMNY_PURPLE}>{t("main.see_all")}</Text>
                </TouchableOpacity>
            </Stack>
            <Spinner visible={loading} />
            <FlatList
                data={maintenance}
                keyExtractor={(maintenance) => maintenance.nid! + maintenance.title}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                initialNumToRender={3}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => { onSelect && onSelect(item.nid!, item.name, item.assigned_entity_title, item.type) }}>
                        <Stack style={styles.itemImageContainer}>
                            <Image source={item.images ? { uri: item.images[0] } : PlaceholderImage} style={styles.itemImage} />
                            <Stack style={styles.imageTextContainer}>
                                {item.todosAmount !== 0 && (
                                    <Text style={styles.imageText}>
                                        {item.todosAmount}{" "}
                                        {item.todosAmount === 1 ? "ToDo" : "ToDo's"}
                                    </Text>
                                )}
                            </Stack>
                        </Stack>
                        <Stack style={styles.itemDetails} alignCenter >
                            <Stack alignCenter paddingHorizontal={8}>

                                <Text style={styles.itemTitle} alignCenter textColor={COLOR_X.SECONDARY} bold>{item.name ? item.name : item.title}</Text>
                                {/* {item.name && (
                                    <Text style={styles.itemSubtitle} alignCenter>ID: {item.nid!}</Text>
                                )} */}

                            </Stack>
                            {item.name && (
                                <Stack alignCenter alignMiddle>
                                    <Text style={styles.itemDescription} alignCenter >{item.name && item.type!}</Text>

                                </Stack>
                            )}

                            <Stack alignCenter alignMiddle>
                                <Text style={styles.itemParentInfo} textColor={COLOR_X.BLACK} alignCenter>{t(`main.${item.assigned_entity_type}`)}: {item.assigned_entity_title}</Text>
                            </Stack>
                        </Stack>
                    </TouchableOpacity>
                )}
            />
            {/* {error && (<><Spacer size="normal" /> <ErrorMessage>{error}</ErrorMessage></>)} */}
        </Stack>
    );
}



export const MaintenanceHorizontalListView = React.memo(MaintenanceHorizontalListViewComponent);