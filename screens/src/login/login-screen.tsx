import { Screen } from "@immotech-component/screen";
import { LoginForm } from "@immotech-feature/login-form";
import type { StackScreenProps } from "@react-navigation/stack";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
  Image
} from "react-native";
import { Modals } from "../navigation/modals";
import Logo from "./Element-1.png";
import { COLOR_X } from "../../../feature/theme/src/theme";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../../feature/auth/src/use-auth";

const styles = {
  container: {
    flex: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
};

export function LoginScreen({ navigation }: StackScreenProps<any>) {

  const signInWithCode = () => {
    navigation.navigate(Modals.ScanLogin);
  };

  return (
    <Screen withSafeArea>
      <LinearGradient
        colors={['#141515', '#22252A', '#2D3342']}
        style={styles.gradient}>
        <StatusBar barStyle="light-content" backgroundColor="#141515" animated />
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView style={styles.container} behavior="position">
            <Stack fill alignCenter padding="normal">
              <Spacer size="large" />
              <Image source={Logo} style={{ width: "80%" }} resizeMode="contain" />


              <Spacer size="small" />
              <LoginForm onScanLoginTap={signInWithCode} />
            </Stack>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </Screen>
  );
}
