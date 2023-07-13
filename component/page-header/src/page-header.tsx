import { Text } from "@immotech-component/text";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { COLOR_X } from "@immotech-feature/theme";
import { ArrowBackIcon, EllipsisVerticalIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { HeaderButton } from "./header-button";
import { GlobalSearch } from "@immotech-component/global-search";

export interface PageHeaderProps {
  children?: string | React.ReactElement;
  leftButton?: string | React.ReactElement;
  leftButtonDisabled?: boolean;
  onTapLeftButton?: () => void;
  rightButton?: string | React.ReactElement | undefined;
  rightButtonDisabled?: boolean;
  rightButtonLoading?: boolean;
  onTapRightButton?: () => void;
  showBackButton?: boolean;
  showRightButton?: boolean;
  accentColor?: COLOR | COLOR_X;
  backButtonColor?: COLOR | COLOR_X;
  hideGlobalSearch?: boolean;
}

export function PageHeader({
  accentColor,
  leftButton,
  rightButton,
  leftButtonDisabled,
  rightButtonDisabled,
  rightButtonLoading,
  onTapLeftButton,
  onTapRightButton,
  showBackButton,
  showRightButton,
  children,
  backButtonColor,
  hideGlobalSearch
}: PageHeaderProps) {
  const { goBack } = useNavigation<any>();

  const isFocused = useIsFocused();
  const [isNavigatingBack, setIsNavigatingBack] = React.useState(false);

  const handleGoBack = () => {
    if (!isNavigatingBack) {
      setIsNavigatingBack(true);
      goBack();
    }
  };

  React.useEffect(() => {
    if (isFocused) {
      setIsNavigatingBack(false);
    }
  }, [isFocused]);

  return (
    <Stack fillHorizontal>
      <Spacer size="large" />
      <Spacer size="small" />
      {!hideGlobalSearch && (
        <>
          <GlobalSearch />
        </>
      )}
      <Stack
        horizontal
        fillHorizontal
        alignMiddle
        // width={"100%"}
        padding={["horizontal:normal", "vertical:small"]}
      >
        {showBackButton ? (
          <Stack alignMiddle>
            <HeaderButton onTap={onTapLeftButton ?? handleGoBack}>
              <ArrowBackIcon color={backButtonColor ?? COLOR_X.BLACK} />
            </HeaderButton>
          </Stack>
        ) : (
          <Stack alignMiddle>
            <HeaderButton
              disabled={leftButtonDisabled}
              onTap={onTapLeftButton ?? goBack}
            >
              {leftButton}
            </HeaderButton>
          </Stack>
        )}

        <Stack style={{ flexGrow: 1 }} alignCenter alignMiddle>
          {typeof children === "string" ? (
            <Text bold alignCenter textColor={COLOR_X.BLACK}>
              {children}
            </Text>
          ) : (
            children
          )}
        </Stack>

        {showRightButton ? (
          <Stack alignRight alignMiddle>
            <HeaderButton onTap={onTapRightButton}>
              <EllipsisVerticalIcon color={COLOR_X.BLACK} />
            </HeaderButton>
          </Stack>
        ) : (
          <Stack>
            <HeaderButton
              disabled={rightButtonDisabled}
              loading={rightButtonLoading}
              onTap={onTapRightButton}
            >
              {rightButton}
            </HeaderButton>
          </Stack>
        )}

      </Stack>
    </Stack>
  );
}
