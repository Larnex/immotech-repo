import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Stack } from 'native-x-stack';
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Spacer } from 'native-x-spacer';
import { Icon } from "@immotech-component/icon-component";


interface Props {
    activeHeaderButton: string;
    setActiveHeaderButton: React.Dispatch<React.SetStateAction<string>>;
    no3dModels?: boolean;
}




export function SwitchHeader({ activeHeaderButton, setActiveHeaderButton, no3dModels }: Props) {
    const { t } = useTranslation();

    const [buttons, setButtons] = React.useState([{
        id: "overview",
        logo: "overview",
        label: "main.overview"
    }, {
        id: "map",
        logo: "map",
        label: 'properties_details.map'
    }, {
        id: "info",
        logo: "info",
        label: "main.detailed_info"
    }

    ])

    React.useEffect(() => {
        if (!no3dModels) {
            setButtons(prevButtons => [...prevButtons, {
                id: "3d-model",
                logo: '3d-model',
                label: 'model_types.3d_view'
            }])
        };
    }, [no3dModels]);



    const handleButtonPress = useCallback((buttonId: string) => {
        setActiveHeaderButton(buttonId);
    }, [setActiveHeaderButton]);

    return (
        <Stack style={styles.container} padding={["horizontal:normal", "vertical:small"]}>
            <Stack horizontal fillHorizontal width={"100%" as any}>
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
                                activeHeaderButton === id && styles.selectedCategoryButton,
                            ]}
                            onPress={() => handleButtonPress(id)}

                        >
                            {no3dModels && id === '3d-models'}
                            <Text style={[styles.buttonText, activeHeaderButton === id && styles.selectedCategoryButtonText]}>{t(label)}</Text>
                            <Spacer size="x-small" />
                            <Icon name={logo} size={20} style={[styles.buttonIcon, activeHeaderButton === id && styles.selectedButtonIcon]} />
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
        backgroundColor: "#4673FF",
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