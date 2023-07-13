import { BottomSheet } from "@immotech-component/bottom-sheet";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { SearchResultList } from "./search-result-list";
import { SearchIcon } from "native-x-icon";
import { StyleSheet, TextInput, View } from "react-native";




export function SearchResultModal() {

    const [newQuery, setNewQuery] = React.useState('');

    const textInputRef = React.useRef<TextInput>(null);

    const { t } = useTranslation();

    const [visible, , close] = useOpenClose(true);

    const { goBack } = useNavigation();



    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                textInputRef.current?.focus();

            }, 500);

            return () => {
                setNewQuery('');
            }
        }, [])
    );




    const handleQueryChange = React.useCallback((text: string) => {
        setNewQuery(text);
    }, []);

    const handleItemPress = () => {
        close();
    }


    return (
        <BottomSheet visible={visible} snapPoints={["100%"]} onClose={goBack}>
            <Stack fill padding="normal">
                <Stack>
                    <Stack style={styles.searchContainer}>
                        <SearchIcon size={32} color={COLOR_X.PLACEHOLDER_TEXT} />

                        <TextInput
                            ref={textInputRef}
                            style={styles.searchInput}
                            placeholder={`${t('main.search_by_name')}`}
                            onChangeText={handleQueryChange}
                            placeholderTextColor={"#747C7C"}
                            defaultValue={newQuery}
                        />
                    </Stack>
                </Stack>
                <Stack>
                    <SearchResultList query={newQuery} onItemPress={handleItemPress} />
                </Stack>
            </Stack>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2EA',
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 8,

    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        lineHeight: 20,
        paddingHorizontal: 8
    }
});
