import React, { useMemo } from "react";
import {
    StyleProp,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    TextStyle,
} from "react-native";
import { styles as s } from "tachyons-react-native";
import { TextStyleProps, useTextStyle } from "native-x-theme";
import { COLOR_X } from "@immotech-feature/theme";

export interface TextInputProps
    extends RNTextInputProps,
    TextStyleProps {
    style?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export function TextInputEditMode(props: TextInputProps) {
    const { style, inputStyle, ...otherProps } = props;

    const defaultStyle = useTextStyle({
        fontSize: "normal",
        textColor: COLOR_X.BLACK,
    });

    const textStyle = useTextStyle({ ...props });

    const composedStyle = useMemo(
        () => [
            defaultStyle,
            textStyle,
            { fontFamily: "DM Sans" },
            inputStyle,
            { letterSpacing: 0.55 },
        ],
        [defaultStyle, textStyle, inputStyle]
    ) as TextStyle[];

    return (
        <RNTextInput
            allowFontScaling={false}
            style={[composedStyle as never, style]}
            {...otherProps}
        />
    );
}