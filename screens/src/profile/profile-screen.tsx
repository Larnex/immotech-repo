import { Button } from "@immotech-component/button";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { useAuth } from "@immotech-feature/auth";
import { COLOR_X } from "@immotech-feature/theme";
import { t } from "i18next";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { StatusBar } from "react-native";
import { PageHeader } from "../../../component/page-header/src/page-header";

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  return (
    <Screen>
      <StatusBar backgroundColor={COLOR_X.ACCENT} animated />
      <PageHeader showBackButton
        accentColor={COLOR_X.SECONDARY}
        hideGlobalSearch
      />



      <Stack fill backgroundColor={COLOR.PRIMARY}>
        <Stack
          style={{ paddingHorizontal: 25 }}
          fill
          backgroundColor={COLOR_X.PRIMARY}
        >
          <Spacer size="large" />
          <Spacer size="normal" />

          <Text textColor={COLOR_X.BLACK}>
            {t("profile.username")}: {user?.name}
          </Text>

          <Spacer size="large" />

          <Tappable onTap={signOut}>
            <Button>{t("profile.sign_out")}</Button>
          </Tappable>
        </Stack>
      </Stack>
    </Screen>
  );
}
