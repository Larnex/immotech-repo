import {
    BottomSheet,
    BottomSheetScrollView
} from "@immotech-component/bottom-sheet";
import { Screens } from '@immotech/screens';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from "@immotech-component/text";
import { AddEntity } from "@immotech-feature/entity-add";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        minWidth: "70%",
        backgroundColor: '#061A40',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
    },
});

interface Props {
    onSelectType?: (type: Screens) => void;
};

export function ChooseTypeModal({ onSelectType }: Props) {
    const { t } = useTranslation();

    const [visible, , close] = useOpenClose(false);

    const { goBack } = useNavigation();

    return (
        <BottomSheet visible={visible} snapPoints={["90%"]} onClose={goBack}>
            <BottomSheetScrollView>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectType!(Screens.EntitiesHome)}>
                        <Text style={styles.buttonText}>{t("entities_list.add_new")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectType!(Screens.PropertiesHome)}>
                        <Text style={styles.buttonText}>{t("properties_list.add_new")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectType!(Screens.UnitsHome)}>
                        <Text style={styles.buttonText}>{t("unit.add_new")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectType!(Screens.MaintenanceHome)}>
                        <Text style={styles.buttonText}>{t("tga.add_new")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectType!(Screens.ToDosHome)}>
                        <Text style={styles.buttonText}>{t("todo.add_new")}</Text>
                    </TouchableOpacity>


                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};
