import { Button } from '@immotech-component/button';
import { COLOR_X } from '@immotech-feature/theme';
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from 'react';
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import { AttributesList } from '../../property-api/src/use-property';
import { DropdownAttribute } from './attribute-dropdown';
import { NoteFormItem } from '@immotech-feature/todo-form-items';
import { AttributeValueFormItem } from '../../property-form-items/src/attribute-value-form-item';

interface Attribute {
    attribute?: string;
    value?: string;
}

interface Props {
    attributes: Attribute[] | [];
    attributesList?: AttributesList;
    addAttribute: () => void;
    removeAttribute: (index: number) => void;
    attributeChange: (attribute: string, index: number) => void;
    attributeValueChange: (index: number, value: string) => void;
}

export function AttributesForm({ addAttribute, removeAttribute, attributeChange, attributeValueChange, attributes, attributesList }: Props) {
    const { t } = useTranslation();

    const [open, setOpen] = React.useState<boolean[]>([]);
    const [attributeType, setAttributeType] = React.useState<(string | null)[]>([]);


    const attributePick = React.useMemo(() => Object.entries(attributesList ?? {}).map((value: any) => {
        return {
            label: value[1],
            value: value[0],
        };
    }),
        [attributesList])

    return (
        <>
            {attributes.map((attribute, index) => (
                <React.Fragment key={index}>
                    <Spacer size="small"></Spacer>

                    <DropdownAttribute
                        index={index}
                        items={attributePick}
                        value={attribute.attribute!}
                        attributeChange={attributeChange}
                    />
                    <Spacer size="small"></Spacer>
                    <AttributeValueFormItem
                        value={attribute.value && attribute.value}
                        onValueChange={(text) => {
                            attributeValueChange(index, text)
                        }}
                    />

                    <Spacer size="small"></Spacer>

                    <Stack alignCenter>
                        <Button backgroundColor={COLOR_X.ACCENT7} height={40} maxWidth={300} onTap={() => removeAttribute(index)}>
                            {t("attribute.delete")}
                        </Button>
                    </Stack>
                </React.Fragment>
            ))}
            <Spacer size="small"></Spacer>
            <Stack alignCenter>
                <Button backgroundColor={COLOR_X.ACCENT6} onTap={addAttribute} height={40} maxWidth={300}>{t("attribute.add")}</Button>
            </Stack>
            <Spacer size="small"></Spacer>

        </>
    );
}