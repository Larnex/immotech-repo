import { Stack } from "native-x-stack";
import { COLOR, ContainerStyleProps, TextStyleProps } from "native-x-theme";
import React from "react";
import { Text } from "@immotech-component/text";

interface Props extends TextStyleProps, ContainerStyleProps {
  children?: Error | string | null;
  alignCenter?: boolean;
}

export function ErrorMessage({
  textColor = COLOR.ERROR,
  padding = "normal",
  alignCenter = true,
  children,
  ...props
}: Props) {
  if (children == null || children == undefined) {
    return null;
  }

  const displayText = () => {
    if (typeof children === "string") {
      return children.toString();
    }

    if (children instanceof Error) {
      if (children.toString() == "undefined") {

        return "An unknown error occurred";

      }
      return children.message.toString() || "An unknown error occurred";
    }

    return "An unknown error occurred";
  };
  return (
    <Stack {...props} padding={padding} alignCenter={alignCenter}>
      <Text textColor={textColor} alignCenter>
        {displayText()}
      </Text>
    </Stack>
  );
}
