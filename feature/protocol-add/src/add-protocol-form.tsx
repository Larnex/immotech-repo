import { useActionSheet } from "@expo/react-native-action-sheet";
import { Button } from "@immotech-component/button";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Form, FormItem } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { TextInput } from "@immotech-component/text-input";
import { ProtocolDataType, ProtocolInputType, ProtocolState } from "@immotech-feature/protocol-api";
import { COLOR_X } from "@immotech-feature/theme";
import { useQueryClient } from "@tanstack/react-query";
import { CameraIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-native";


export type AddProtocolParams = Pick<
  ProtocolInputType,
  "field_tp_assignment" | "field_tp_line_items"
>;


const styles = {
  imageButton: {
    borderStyle: "dashed" as const,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden" as const,
  },
};

export type Image = {
  path: string;
  data: string;
};

enum Statuses {
  NOT_TESTABLE = "not_testable",
  DEFECT = "defect",
  NO_DAMAGE = "no_damage",
  LEAKAGE = "leakage",
  MISSING = "missing",
  DIRTY = "dirty",
  CLOGGED = "clogged",
  DISTURBANCE = "disturbance",
  NOT_FUNCTIONAL = "not_functional",
  VANDALISM = "vandalism",
  EXPIRED = "expired"
};
interface Props {
  onSubmit?: (data: ProtocolDataType, skipped?: boolean, maintenanceNumber?: number, imagesArray?: any) => void;
  maintenanceId?: string;
  maintenanceNumber?: number;
  protocol?: ProtocolState;
  onHeightChange: (height: number) => void;
}

export const AddProtocolForm = React.memo(({ onSubmit, maintenanceId, protocol, maintenanceNumber, onHeightChange }: Props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  let isComponentMounted = React.useRef(true);

  const [imagesArray, setImagesArray] = React.useState<any>([]);

  const [skipEnabled, setSkipEnabled] = React.useState(protocol?.skipEnabled ?? false);

  const toggleSwitch = React.useCallback(() => {
    setSkipEnabled((previousState) => !previousState);
  }, []);

  const [chooseImage, { data }] = useImagePicker(true);
  const { showActionSheetWithOptions } = useActionSheet();

  const [formValid, setFormValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [status, setStatus] = React.useState<string | undefined>(protocol ? protocol.status : undefined);

  React.useEffect(() => {
    isComponentMounted.current = true;

    if (protocol) {
      console.log("🚀 ~ file: add-protocol-form.tsx:91 ~ React.useEffect ~ protocol:", protocol);
      setStatus(protocol.status);
      setImagesArray(protocol.imagesArray);
      onFormSubmit({
        state: {
          description: protocol.description,
          fix: protocol.fix,
        }, isValid: false, maintenanceIndex: maintenanceNumber
      })
    }

    return () => {
      isComponentMounted.current = false;
    }
  }, []);

  const onAddImage = React.useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ["Take a photo", "Choose from library", "Cancel"],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) {
          chooseImage(ImageSource.CAMERA);
        } else if (index === 1) {
          chooseImage(ImageSource.GALLERY);
        }
      }
    );
  }, [showActionSheetWithOptions, chooseImage]);

  React.useEffect(() => {
    if (data) {
      if (isComponentMounted.current) {
        setImagesArray((prev: any) => {
          if (Array.isArray(data)) {
            return [...prev, ...data.map(item => ({ path: item.path, data: item.data }))];
          } else {
            return [...prev, { path: data.path, data: data.data }];
          }
        });
      }
    }
  }, [data]);

  const statusPick = React.useMemo(
    () =>
      Object.entries(Statuses).map((value: any) => {
        return {
          label: `${t(`protocols_statuses.${value[1]}`)}`,
          value: value[1],
        };
      }),
    [Statuses]
  );

  const onSelectStatus = React.useCallback((item: string) => {
    setStatus(item);
  }, []);

  const onFormSubmit = async ({
    state,
    isValid,
    maintenanceIndex
  }: {
    state: any;
    isValid: boolean;
    maintenanceIndex?: number;
  }) => {
    if (isComponentMounted.current) {
      queryClient.setQueryData([`protocol:${maintenanceId}`], { ...state, status, imagesArray, skipEnabled })
    }


    if (status === undefined && !skipEnabled) {
      isValid = false;
      setFormValid(isValid);
      setErrorMessage("Please select status or skip");
    } else if (
      status !== "no_damage" &&
      status !== "not_testable" &&
      status !== undefined &&
      state.description === undefined &&
      !skipEnabled
    ) {
      isValid = false;

      setFormValid(isValid);
      setErrorMessage("Please enter description");
    } else {
      isValid = true;
      setFormValid(true);
    }

    state = {
      field_tp_maintenance_obj: maintenanceId,
      field_tp_line_item_status: {
        und: status,
      },

      field_tp_diagnosis: {
        und: [
          {
            value: state.description,
          },
        ],
      },

      field_tp_action: {
        und: [
          {
            value: state.fix,
          },
        ],
      },

      field_tp_line_item_pictures:
        imagesArray &&
        imagesArray.map((item: { data: string; path: string }) => item.data),
    };
    if (isValid) {
      onSubmit?.(state, skipEnabled, maintenanceIndex || maintenanceNumber, imagesArray);
    }
  };

  return (
    <>
      <Form<AddProtocolParams> onSubmit={onFormSubmit}>
        {({ submitForm }) => {
          return (
            <Stack fill>
              <Spacer size="small" />
              <Stack alignMiddle alignCenter horizontal>
                <Spacer size="small" />
                <Text textColor={COLOR_X.BLACK}>
                  {t("protocol.skip_maintenance")}
                </Text>
                <Spacer size="x-small" />
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={skipEnabled ? COLOR_X.SUCCESS_LIGHT : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={skipEnabled}
                />
              </Stack>
              {!skipEnabled && (
                <Stack onLayout={event => {
                  const { height } = event.nativeEvent.layout;
                  onHeightChange(height);
                }}>
                  <Spacer size="small" />

                  {!formValid && (
                    <ErrorPopup
                      error={errorMessage}
                      title={`${t("protocol.form_invalid")}`}
                    ></ErrorPopup>
                  )}
                  <Spacer size="small"></Spacer>
                  <Picker
                    placeholder={`${t("todo.add.choose_status")}`}
                    items={statusPick}
                    backgroundColor={COLOR.PRIMARY}
                    onChange={onSelectStatus}
                    value={status!}

                  />

                  {/* <RNPickerSelect
                    placeholder={`${t("todo.add.choose_status")}`}
                    items={statusPick}
                    onValueChange={onSelectStatus}
                    value={status!}

                  /> */}

                  <Spacer size="small" />
                  {status == "no_damage" || status == "not_testable" ? null : (
                    <Stack>
                      <FormItem name="description">
                        <TextInput
                          placeholder={`${t("todo.details.description")}`}
                          placeholderColor={COLOR.TERTIARY}
                          backgroundColor={COLOR.PRIMARY}
                          multiline
                          height={70}
                          defaultValue={protocol && protocol.description}
                          value={protocol && protocol.description}
                        />
                      </FormItem>
                      <Spacer size="x-small" />
                      <FormItem name="fix">
                        <TextInput
                          placeholder={`${t("protocol.fix")}`}
                          placeholderColor={COLOR.TERTIARY}
                          backgroundColor={COLOR.PRIMARY}
                          multiline
                          height={70}
                          defaultValue={protocol && protocol.fix}
                          value={protocol && protocol.fix}
                        />
                      </FormItem>
                      <Spacer size="x-small" />

                      <Tappable onTap={onAddImage} style={styles.imageButton}>
                        <Stack
                          fillHorizontal
                          backgroundColor={COLOR.DIVIDER}
                          padding={["normal"]}
                          alignMiddle
                          alignCenter
                          horizontal

                        >
                          <CameraIcon color={COLOR.TERTIARY}></CameraIcon>
                          <Spacer size="small"></Spacer>
                          <Text textColor={COLOR.TERTIARY} alignCenter>
                            {t("main.take_photo")}
                          </Text>
                        </Stack>
                      </Tappable>
                      {!!imagesArray.length && (
                        <Stack alignCenter alignMiddle>
                          {imagesArray.map((value: Image) => {
                            return (
                              <Stack key={value.path}>
                                <Spacer size="small"></Spacer>
                                <Image
                                  borderRadius="large"
                                  width={250}
                                  height={210}
                                  source={{ uri: value.path }}
                                  key={value.path}
                                />
                                <Spacer size="small"></Spacer>
                              </Stack>
                            );
                          })}
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Stack>
              )}

              <Spacer size="normal" />

              <Button rounded={false} height={48} onTap={submitForm}>
                {t("protocol.confirm")}
              </Button>
              <Spacer />
            </Stack>
          );
        }}
      </Form>
    </>
  );
});
