import { BottomSheet } from "@immotech-component/bottom-sheet";
import { useOpenClose } from "@immotech/util";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "native-x-stack";
import React from "react";
import { Modals } from "../navigation/modals";


type FilterModalParamList = {
    [Modals.MarkerDetails]: {
        property?: any
    };
};

export function MarkerDetailsModal() {
    const [visible, , close] = useOpenClose();
    const { goBack } = useNavigation();


    return (
        <BottomSheet visible={visible} onClose={goBack} snapPoints={[550]}>
            <Stack fill padding="horizontal:large" alignLeft minHeight={550}>
            </Stack>
        </BottomSheet>
    );
}
