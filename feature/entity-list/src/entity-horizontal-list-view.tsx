import { ErrorMessage } from '@immotech-component/data-view/src/error-message';
import { MapSnapshot } from "@immotech-component/map-snapshot";
import { Text } from '@immotech-component/text';
import { Entity, useEntities } from '@immotech-feature/entity-api';
import { Spacer } from 'native-x-spacer';
import { Stack } from 'native-x-stack';
import React from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { COLOR_X } from '../../theme/src/theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import DeviceInfo from "react-native-device-info";
import { styles } from "@immotech-component/horizontal-lists-styles";
import PlaceholderImage from "../../../component/assets/default-building.4e26911c4ea17f38f4e8.jpg";


const isTabletDevice = DeviceInfo.isTablet();


interface Props {
    showFullList?: () => void;
    onSelect?: (id: string, internalID: string, title?: string) => void;
    setLastClickedItem?: (item: Entity) => void;
}

export function EntityHorizontalListView({ showFullList, onSelect, setLastClickedItem }: Props) {

    const { data: entities, isLoading: loading, error } = useEntities();

    const { t } = useTranslation();
    return (
        <Stack paddingRight={16}>
            <Stack style={styles.header} justifyBetween paddingLeft={16}>
                <Stack alignMiddle>
                    <Text textColor={COLOR_X.PLACEHOLDER_TEXT} style={styles.sideText}>{t("entities_list.last_viewed")}</Text>
                </Stack>
                <TouchableOpacity style={styles.seeAllButton} onPress={() => showFullList!()}>
                    <Text style={styles.seeAllText}>{t("main.see_all")}</Text>
                </TouchableOpacity>
            </Stack>
            <Spinner visible={loading} />
            <FlatList
                data={entities}
                // keyExtractor={(entity) => entity.nid}
                keyExtractor={(entity) => entity?.id + entity?.title}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => { onSelect && onSelect(item?.nid!, item?.id, item?.title) }} >
                        <Stack style={styles.itemImageContainer}>
                            {/* <MapSnapshot city={item?.city!} /> */}

                            <Image source={item?.image ? { uri: item?.image } : PlaceholderImage} style={{ width: '100%', height: '100%' }} />

                            <Stack style={styles.imageTextContainer} alignMiddle>
                                {!!item?.propertiesAmount && (
                                    <Text style={styles.imageText}>
                                        {item?.propertiesAmount}{" "}
                                        {item?.propertiesAmount === 1 ? t("main.property") : t("main.properties")}

                                    </Text>
                                )}

                            </Stack>
                        </Stack>
                        <Stack style={styles.itemDetails} horizontal fillHorizontal justifyBetween>
                            <Stack width={"60%" as any} fill>
                                <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail" textColor={COLOR_X.SECONDARY} bold>{item?.title}</Text>
                                <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">ID: {item?.id}</Text>
                            </Stack>
                            <Stack alignRight fill>
                                <Text style={styles.itemDescription}>{item?.city}</Text>
                                <Text style={styles.itemDescription}>{item?.zip_code}</Text>
                            </Stack>
                        </Stack>
                    </TouchableOpacity>
                )}
            />
            {/* {!!error && (<><Spacer size="normal" /> <ErrorMessage>{error}</ErrorMessage></>)} */}
        </Stack>
    );
}


