import { Text } from "@immotech-component/text";
import { EntitiesList } from "@immotech-feature/entity-list";
import { MaintenanceList } from "@immotech-feature/maintenance-list";
import { PropertiesList } from "@immotech-feature/property-list";
import { ToDoList } from "@immotech-feature/todo-list";
import { UnitList } from "@immotech-feature/unit-list";
import PropertiesHome from "@immotech/screens/src/properties/properties-home";
import { Stack } from "native-x-stack";
import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screens } from "@immotech/screens";
import { PropertyHorizontalListView } from "../../../feature/property-list/src/property-horizontal-list-view";
import { EntityHorizontalListView } from "../../../feature/entity-list/src/entity-horizontal-list-view";
import { MaintenanceHorizontalListViewComponent } from "../../../feature/maintenance-list/src/maintenance-horizontal-list-view";
import { UnitHorizontalListView } from "../../../feature/unit-list/src/unit-horizontal-list-view";
import { ToDosHorizontalListView } from "../../../feature/todo-list/src/todos-horizontal-list-view";


type CategoriesType = typeof categories[number];

const categories = ["entities", "properties", "utilization_units", "maintenance", "todos"];

interface Props {
    showEntityList?: () => void;
    showPropertyList?: () => void;
    showUnitsList?: () => void;
    showMaintenanceList?: () => void;
    showToDoList?: () => void;
    showEntityDetails?: (id: string, internalID?: string, title?: string) => void;
    showPropertyDetails?: (id: string, internalID: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
    showUnitDetails?: (id: string, internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
    showMaintenanceDetails?: (id: string, internalID?: string, assignedEntity?: string, type?: string, parentId?: string) => void;
    showToDoDetails?: (id: string, title?: string) => void;
}

export const NavigationSwipe = ({ showEntityList, showPropertyList, showEntityDetails, showPropertyDetails, showUnitDetails, showUnitsList, showMaintenanceDetails, showMaintenanceList, showToDoDetails, showToDoList }: Props) => {


    const { t } = useTranslation();

    const [selectedCategory, setSelectedCategory] = React.useState<CategoriesType>(categories[0]);

    const handleCategoryPress = React.useCallback((category: CategoriesType) => {
        setSelectedCategory(category);
    }, []);

    const renderContent = () => {
        switch (selectedCategory) {
            case "entities":
                return (
                    selectedCategory === "entities" && (
                        <EntityHorizontalListView showFullList={showEntityList} onSelect={showEntityDetails} />
                    )
                );
            case "maintenance":
                return (
                    selectedCategory === "maintenance" && (
                        <MaintenanceHorizontalListViewComponent
                            showFullList={showMaintenanceList}
                            onSelect={showMaintenanceDetails}
                        />
                    )
                );
            case "properties":


                return (
                    selectedCategory === "properties" && (
                        <PropertyHorizontalListView showFullList={showPropertyList} onSelect={showPropertyDetails} />
                    )
                );
            case "utilization_units":
                return (
                    selectedCategory === "utilization_units" && (
                        <UnitHorizontalListView
                            showFullList={showUnitsList}
                            onSelect={showUnitDetails}
                        />
                    )
                );
            case "todos":
                return (
                    selectedCategory === "todos" && (
                        <ToDosHorizontalListView
                            showFullList={showToDoList}
                            onSelect={showToDoDetails}
                        />
                    )
                );
        }
    };


    return (
        <Stack style={styles.container}>
            <Stack horizontal fillHorizontal paddingHorizontal={16} width={"100%" as any}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category) => (
                        <TouchableOpacity key={category} style={[styles.button, selectedCategory === category && styles.selectedCategoryButton]} onPress={() => handleCategoryPress(category)}>
                            <Text style={[styles.buttonText, selectedCategory === category && styles.selectedCategoryButtonText]}> {t(`main.${category}`)}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Stack>
            <Stack style={styles.contentWrapper}>
                {/* <Suspense fallback={<ActivityIndicator size="large" />}> */}
                {renderContent()}
                {/* </Suspense> */}
            </Stack>
        </Stack>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        marginTop: 8,
        marginBottom: 16,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"

    },
    selectedCategoryButton: {
        backgroundColor: "#4673FF",
    },
    selectedCategoryButtonText: {
        color: "#fff",
    },
});

