import React, { useCallback, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Icon } from "@immotech-component/icon-component";
import { Stack } from "native-x-stack";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { useTranslation } from "react-i18next";
import { Spacer } from 'native-x-spacer';


const allButtons = [
    {
        id: "units",
        logo: "unit",
        label: "main.utilization_units",
    },
    {
        id: "maintenance",
        logo: "maintenance",
        label: "main.maintenance",
    },
    {
        id: "todos",
        logo: "todos-list",
        label: "main.todos",
    },
    {
        id: "protocols",
        logo: "todo",
        label: "protocol.protocols_list",
    },
];

interface Props {
    activeButton: string;
    setActiveButton: React.Dispatch<React.SetStateAction<string>>;
    object: "property" | "unit" | "maintenance";
}

export function SwitchList({ activeButton, setActiveButton, object }: Props) {
    const { t } = useTranslation();

    const getButtons = () => {
        if (object === "property") {
            return allButtons;
        } else if (object === "unit") {
            return allButtons.slice(1, 3); // Only return "units" and "maintenance" buttons
        } else if (object === "maintenance") {
            return allButtons.slice(1, 2); // Only return the "maintenance" button
        }
        return []; // Default to an empty array
    };

    const buttons = getButtons();


    const handleButtonPress = useCallback((buttonId: string) => {
        setActiveButton(buttonId);
    }, [setActiveButton]);


    return (
        <Stack style={styles.container} padding={["horizontal:normal", "vertical:small"]}>
            {/* <Text textColor={COLOR_X.BLACK} bold>{t("properties_details.select_list")}</Text> */}
            <Stack horizontal fillHorizontal padding={["vertical:small"]} width={"100%"}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                // contentContainerStyle={styles.buttonScrollViewContent}
                >
                    {buttons.map(({ id, logo, label }) => (
                        <TouchableOpacity
                            key={id}
                            style={[
                                styles.button,
                                activeButton === id && styles.selectedCategoryButton,
                            ]}
                            onPress={() => handleButtonPress(id)}

                        >
                            <Text style={[styles.buttonText, activeButton === id && styles.selectedCategoryButtonText]}>{t(label)}</Text>
                            <Spacer size="x-small" />
                            <Icon name={logo} size={20} style={[styles.buttonIcon, activeButton === id && styles.selectedButtonIcon]} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Stack>
        </Stack>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
    },
    buttonContainer: {
        // paddingHorizontal: 16,
        marginBottom: 16,
    },
    buttonScrollViewContent: {
        alignItems: "center",
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'
    },
    selectedCategoryButton: {
        backgroundColor: "#004040",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"

    },
    selectedCategoryButtonText: {
        color: "#fff",
    },

    buttonIcon: {
        tintColor: "#333"
    },
    selectedButtonIcon: {
        tintColor: "#fff"
    }

});