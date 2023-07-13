import { ErrorPopup } from "@immotech-component/error-popup";
import { Popup } from "@immotech-component/popup";
import { Text } from "@immotech-component/text";
import { useAuth } from "@immotech-feature/auth";
import type { StackScreenProps } from "@react-navigation/stack";

import {
  CodeScanner,
  QRCodeType,
  ScannedQRCode
} from "../../../feature/code-scanner";

import { CloseIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Spinner } from "native-x-spinner";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useCallback } from "react";
import { COLOR_X } from "../../../feature/theme/src";
import { useOpenClose } from "../../../util/src/use-open-close";
import { RootStackParamList } from "../navigation/root-stack";
import QRCodeIcon from "./qr-code-icon.svg";

export function ScanLoginModal({
  navigation: { goBack },
}: StackScreenProps<RootStackParamList>) {
  const { loading, signInWithToken, error: authError } = useAuth();
  const [error, showError, closeError] = useOpenClose();
  const closeModal = useCallback(() => goBack(), [goBack]);
  const onScan = useCallback(
    (code: ScannedQRCode) => {
      switch (code.type) {
        case QRCodeType.AUTH:
          signInWithToken(code.id);
          closeModal();
          break;
        default:
          break;
      }
    },
    [closeModal, signInWithToken]
  );

  return (
    <Popup visible accentColor={COLOR.SECONDARY}>
      <Stack
        alignCenter
        fill
        padding={["vertical:large", "horizontal:large"]}
        backgroundColor={COLOR.ACCENT}
      >
        <Spacer size="small" />
        <Stack horizontal fillHorizontal alignCenter alignMiddle>
          <QRCodeIcon />
          <Spacer size="small" />
          <Text fontSize="large" alignCenter textColor={COLOR.PRIMARY}>
            Scan login
          </Text>
        </Stack>
        <Spacer />
        <Stack fill borderRadius="large" alignMiddle alignCenter>
          {loading ? (
            <Spinner size="large" color={COLOR.PRIMARY} />
          ) : (
            <CodeScanner onSuccess={onScan} onError={showError} />
          )}
        </Stack>
        <Spacer />
        <Tappable onTap={closeModal}>
          <Stack
            fillHorizontal
            alignCenter
            width={78}
            height={78}
            borderRadius="round"
            alignMiddle
            backgroundColor={COLOR_X.ACCENT3}
          >
            <CloseIcon size={42} color={COLOR.PRIMARY} />
          </Stack>
        </Tappable>
      </Stack>
      {authError || error ? (
        <ErrorPopup
          title="Sign-in Failed"
          error="The scanned code is not valid. Please try again."
          onDismiss={closeError}
        />
      ) : null}
    </Popup>
  );
}
