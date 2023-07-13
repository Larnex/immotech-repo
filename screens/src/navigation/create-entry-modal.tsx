import { AnimatedButton } from "@immotech-component/animated-button";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import React from 'react';
import { useTranslation } from "react-i18next";
import { StyleSheet, Animated } from "react-native";
import { DamageReportModal } from "../damage-report/damage-report-modal";
import { AddEntityModal } from "../entities/add-entity-modal";
import { AddMaintenanceModal } from "../maintenance/add-maintenance-modal";
import { AddPropertyModal } from "../properties/add-property-modal";
import { AddUnitModal } from "../unit/add-unit-modal";
import { Screens } from "./screens";



const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: "8.95%",
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        backgroundColor: "#FFF",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5,
        paddingTop: 30,
        paddingBottom: 15,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        zIndex: 0,
        height: 'auto'

    },
    button: {
        minWidth: "80%",
        backgroundColor: '#6C63FF',

        borderRadius: 5,
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
    },
});

const buttonHeight = 5;
const buttonMargin = 3;

export function CreateEntryModal({ currentScreen, parentId, isOpen, isModalOpen }: { currentScreen?: string, parentId?: any, isOpen?: boolean, isModalOpen: (isOpen: boolean | null) => void }) {
    const { t } = useTranslation();
    const [isCreateEntryModalVisible, setIsCreateEntryModalVisible] = React.useState(true);


    const heightAnimation = React.useRef(new Animated.Value(0)).current;




    const navigation = useNavigation();
    const [activeModal, setActiveModal] = React.useState<string | null>(null);

    let animatedButtons = [
        {
            label: t("entities_list.add_new"),
            delay: 500,
            onPress: () => handleButtonPress("AddEntityModal")
        },
        {
            label: t("properties_list.add_new"),
            delay: 400,
            onPress: () => handleButtonPress("AddPropertyModal")
        },
        {
            label: t("unit.add_new"),
            delay: 300,
            onPress: () => handleButtonPress("AddUnitModal")
        },
        {
            label: t("tga.add_new"),
            delay: 200,
            onPress: () => handleButtonPress("AddMaintenanceModal")
        },
        {
            label: t("todo.add_new"),
            delay: 100,
            onPress: () => handleButtonPress("AddToDoModal")
        }
    ];

    React.useEffect(() => {
        Animated.timing(heightAnimation, {
            toValue: !isOpen ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isOpen]);



    const getAnimatedButtons = () => {
        let buttons = [...animatedButtons];

        if (currentScreen === Screens.EntitiesHome || currentScreen === Screens.EntityDetails || currentScreen === Screens.PropertiesHome || currentScreen === Screens.MaintenanceHome ||
            currentScreen === Screens.ToDosHome || currentScreen === Screens.ToDoDetails || currentScreen === Screens.MaintenanceDetails || currentScreen === Screens.UnitsHome) {
            return;
        }

        if (currentScreen === Screens.PropertyDetails) {
            buttons = buttons.slice(2);
        } else if (currentScreen === Screens.UnitDetails) {
            buttons = buttons.slice(3);
        }


        return buttons.map((button, index) => (
            <AnimatedButton key={index} label={button.label} onPress={button.onPress} delay={button.delay} style={styles.button} isClosing={isOpen} />
        ));
    };




    const handleButtonPress = (modal: string) => {
        setIsCreateEntryModalVisible(false);
        setActiveModal(modal);
    };

    const closeModal = () => {
        setActiveModal(null);
        isModalOpen(false);
        setIsCreateEntryModalVisible(true);
    };


    return (
        <>
            <Animated.View style={[styles.container,]} pointerEvents={isCreateEntryModalVisible ? 'auto' : 'none'}>
                {getAnimatedButtons()}
            </Animated.View>

            {(activeModal === "AddEntityModal" || currentScreen === Screens.EntitiesHome) && <AddEntityModal onRequestClose={closeModal} />}
            {(activeModal === "AddPropertyModal" || currentScreen === Screens.EntityDetails || currentScreen === Screens.PropertiesHome) && <AddPropertyModal onRequestClose={closeModal} />}
            {(activeModal === "AddUnitModal" || currentScreen === Screens.UnitsHome) && <AddUnitModal onRequestClose={closeModal} />}
            {(activeModal === "AddToDoModal" || currentScreen === Screens.ToDosHome || currentScreen === Screens.ToDoDetails || currentScreen === Screens.MaintenanceDetails) && <DamageReportModal onRequestClose={closeModal} />}
            {(activeModal === "AddMaintenanceModal" || currentScreen === Screens.MaintenanceHome) && <AddMaintenanceModal onRequestClose={closeModal} />}

        </>
    );
}