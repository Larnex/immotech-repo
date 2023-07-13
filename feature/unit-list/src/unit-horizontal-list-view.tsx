import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Stack } from 'native-x-stack';
import { Text } from '@immotech-component/text';
import { Spacer } from 'native-x-spacer';
import Spinner from 'react-native-loading-spinner-overlay';
import { ErrorMessage } from '@immotech-component/data-view/src/error-message';
import { useTranslation } from 'react-i18next';
import { UnitResponse, useUnits } from '@immotech-feature/unit-api';
import { COLOR_X } from '../../theme/src/theme';
import { styles } from "@immotech-component/horizontal-lists-styles";

interface Props {
    showFullList?: () => void;
    onSelect?: (id: string, internalID: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
}

export function UnitHorizontalListView({ showFullList, onSelect }: Props) {
    const { data: units, isLoading: loading, error } = useUnits();

    const { t } = useTranslation();

    return (
        <Stack paddingRight={16}>
            <Stack style={[styles.header, { justifyContent: "flex-end" }] as any} >
                <TouchableOpacity style={styles.seeAllButton} onPress={() => showFullList!()}>
                    <Text style={styles.seeAllText} alignRight>{t('main.see_all')}</Text>
                </TouchableOpacity>
            </Stack>
            <FlatList
                data={units}
                keyExtractor={(unit) => unit.id + unit.title}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => { onSelect && onSelect(item.nid!, item.id, 'unit', item.lat, item.lon, item.parent_id, item.title) }}>
                        <Stack style={styles.itemDetails}>
                            <Text style={styles.itemTitle} textColor={COLOR_X.SECONDARY} bold>{item.title}</Text>
                            <Text style={styles.itemSubtitle}>ID: {item.id ?? item.nid}</Text>
                            <Text style={styles.itemParentInfo}>{t("main.parent_container")}: {item.parentName}</Text>
                            <Spacer size="x-small" />
                            <Text style={styles.itemDescription}>{t("properties_details.type")}: {item.type}</Text>
                            <Text style={styles.itemDescription}>{t("properties_details.address")}: {item.street}</Text>
                            <Text style={styles.itemDescription}>{item.city}, {item.zip_code}</Text>

                            {!!item.maintenancesAmount && (
                                <Stack style={styles.imageTextContainerUnits} >
                                    <Text style={styles.imageTextUnits}>{item.maintenancesAmount} {t("main.maintenance")}</Text>
                                </Stack>
                            )}
                            {!!item.todosAmount && (
                                <Stack style={styles.imageTextContainerUnits}>
                                    <Text style={styles.imageTextUnits}>
                                        {item.todosAmount}{" "}
                                        {item.todosAmount === 1 ? "ToDo" : "ToDo's"}
                                    </Text>
                                </Stack>
                            )}
                        </Stack>
                    </TouchableOpacity>
                )}
            />
            <Spinner visible={loading} />
        </Stack>
    );
}



