import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "react-i18next";


interface DropdownAttributesProps {
    index: number;
    items: any[];
    value: string;
    attributeChange: (attribute: string, index: number) => void;
}

export const DropdownAttribute: React.FC<DropdownAttributesProps> = ({ index, items, value, attributeChange }) => {
    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);
    const [attributeType, setAttributeType] = React.useState<string | null>(null);

    React.useEffect(() => {
        setAttributeType(value);
    }, [value]);

    return (
        <DropDownPicker
            open={open}
            value={attributeType}
            items={items}
            setValue={setAttributeType}
            setOpen={setOpen}
            listMode="MODAL"
            searchable={true}

            onChangeValue={(item) => {
                attributeChange(item!, index);
            }}
            placeholder={t("attribute.type")!}
            placeholderStyle={{
                fontSize: 16,
                color: "#aaa"
            }}
            containerStyle={{ height: 40 }}
            maxHeight={300}
            style={{
                borderColor: "#4673FF",
                backgroundColor: "#fff",
            }}
            labelStyle={{
                fontSize: 16,
                color: "#4673FF",
                paddingHorizontal: 10,
            }}
            listItemLabelStyle={{
                fontSize: 16,
                color: "#4673FF",
            }}
            dropDownContainerStyle={{
                backgroundColor: "#fff",
                borderColor: "#4673FF",
                borderRadius: 8,
            }}
            listItemContainerStyle={{
                marginVertical: 4,
                marginHorizontal: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
            }}
            customItemContainerStyle={{
                backgroundColor: "#e6f0ff",
            }}

            customItemLabelStyle={{
                color: "#3058d6",

            }}
            searchContainerStyle={{
                borderBottomColor: "transparent"

            }}
            searchTextInputStyle={{
                paddingHorizontal: 10,
                borderColor: "transparent"
            }}
            modalProps={{
                animationType: "slide",
            }}
        />
    );
};
