import React from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Tappable } from "native-x-tappable";
import { Stack } from 'native-x-stack';
import { Text } from '@immotech-component/text';
import { Spacer } from "native-x-spacer";
import { COLOR_X } from '@immotech-feature/theme';
import { useTranslation } from 'react-i18next';
import PlaceholderImage from '../../assets/default-building.4e26911c4ea17f38f4e8.jpg';

interface Props {
    data?: Array<any>;
    onItemPress: (item: any) => void;
}

export function SearchListComponent({ data, onItemPress }: Props) {
    const { t } = useTranslation();

    const renderItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => onItemPress(item)}>
            <Stack fill>
                <Stack paddingVertical={8}>

                    <Image
                        source={item.image ? { uri: item.image } : PlaceholderImage}
                        style={{ width: "100%", height: 150 }}
                    />

                    <Stack alignLeft paddingTop={16}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.queryKey.endsWith("ies")
                            ? item.queryKey.slice(0, -3) + "y"
                            : item.queryKey.endsWith("s")
                                ? item.queryKey.slice(0, -1)
                                : item.queryKey}{" "}</Text>
                        <Spacer size="small"></Spacer>
                    </Stack>
                </Stack>
            </Stack>
        </TouchableOpacity>

    );

    return (
        <Stack style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.nid + item.title}
            />
        </Stack>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        paddingHorizontal: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: "#000",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 12,
        color: '#8E8E93',
    },

});