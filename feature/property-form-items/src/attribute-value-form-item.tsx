import { TextInput } from "@immotech-component/text-input";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
    onValueChange?: (value: string) => void;
    value?: string
}

export function AttributeValueFormItem({ onValueChange, value }: Props) {
    const { t } = useTranslation();

    return (
        <TextInput
            label={`${t("attribute.value")}`}
            placeholderColor={COLOR.TERTIARY}
            borderColor={COLOR.TERTIARY}
            backgroundColor={COLOR.DIVIDER}
            onChangeText={onValueChange}
            value={value}
        />
    );
}
