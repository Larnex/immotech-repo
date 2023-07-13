import React, { ErrorInfo } from "react"
import { ScrollView, TextStyle, View, ViewStyle, Button } from "react-native"
import { Text } from "@immotech-component/text";
// import { Button, Icon, Screen, Text } from "../../components"
// import { colors, spacing } from "../../theme";
import { Screen } from "@immotech-component/screen";
import { BugIcon } from "native-x-icon";
import { COLOR_X } from "../../../feature/theme/src/theme";
import { Stack } from "native-x-stack";

export interface ErrorDetailsProps {
    error: Error
    errorInfo: ErrorInfo
    | null;
    onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
    return (
        <Stack style={$contentContainer}>
            <Stack style={$topSection}>
                <BugIcon size={64} />
                <Text>Something went wrong!</Text>
            </Stack>

            <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
                <Text style={$errorContent} bold>{`${props.error}`.trim()}</Text>
                <Text
                    style={$errorBacktrace}
                >{`${props.errorInfo?.componentStack}`.trim()}</Text>
            </ScrollView>

            <Button
                color={COLOR_X.ACCENT7}
                onPress={props.onReset}
                title="RESET APP"
            />
        </Stack>
    )
}

const $contentContainer: ViewStyle = {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    flex: 1,
}

const $topSection: ViewStyle = {
    flex: 1,
    alignItems: "center",
}

const $errorSection: ViewStyle = {
    flex: 2,
    backgroundColor: "#D7CEC9",
    marginVertical: 16,
    borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
    padding: 16,
}

const $errorContent: TextStyle = {
    color: "#FF4C4C",
}

const $errorBacktrace: TextStyle = {
    marginTop: 16,
    color: "#564E4A",
}

