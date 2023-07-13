import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form } from "@immotech-component/form";
import { Text } from "@immotech-component/text";
import { ArrowForwardIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React, { useCallback } from "react";
import { PasswordFormItem } from "./password-form-item";
import QRCodeIcon from "./qr-code-icon.svg";
import { UsernameFormItem } from "./username-form-item";
import { COLOR_X } from "../../theme/src/theme";

interface FormData {
  username: string;
  password: string;
}

interface Props {
  loading?: boolean;
  error?: Error | null;
  onSubmit?: (username: string, password: string) => void;
  onScanLoginTap?: () => void;
}

const formState: FormData = {
  username: "",
  password: "",
};

export function LoginFormView({
  error,
  loading,
  onSubmit,
  onScanLoginTap,
}: Props) {
  const handleSubmit = useCallback(
    async ({ isValid, state }: { state: FormData; isValid: boolean }) => {
      if (!isValid) {
        return;
      }
      const { username, password } = state;
      onSubmit?.(username, password);
    },
    [onSubmit]
  );

  // TODO: show error popup

  return (
    <Stack fillHorizontal>
      <Form state={formState} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <Stack fillHorizontal padding="large">
            <Text textColor={COLOR.PRIMARY}>Username</Text>
            <UsernameFormItem disabled={loading} />
            <Spacer size="x-small" />
            <Text textColor={COLOR.PRIMARY}>Password</Text>
            <PasswordFormItem disabled={loading} />
            <Spacer size="xx-small" />
            <Stack
              fillHorizontal
              horizontal
              borderColor={COLOR.ERROR}
              alignLeft
              justifyBetween
            >
              <Button
                disabled={loading}
                width={150}
                rightIcon={<QRCodeIcon />}
                onTap={onScanLoginTap}
                textColor={COLOR.PRIMARY}
                size="small"
                backgroundColor={COLOR_X.OMNY_PURPLE}
                paddingHorizontal={25}
              >
                Scan login
              </Button>
              <Button
                loading={loading}
                width={125}
                rightIcon={<ArrowForwardIcon color={COLOR.PRIMARY} />}
                size="small"
                onTap={submitForm}
                backgroundColor={COLOR_X.OMNY_PURPLE}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        )}
      </Form>
      {error ? <ErrorPopup error={error} title="Login Failed" /> : null}
    </Stack>
  );
}
