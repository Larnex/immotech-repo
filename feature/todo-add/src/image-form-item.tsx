import { useActionSheet } from "@expo/react-native-action-sheet";
import { FormItem } from "@immotech-component/form";
import { ImageSource, useImagePicker } from "@immotech-component/image-picker";
import { Text } from "@immotech-component/text";
import { CameraIcon } from "native-x-icon";
import { Image } from "native-x-image";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";

const styles = {
  imageButton: {
    borderStyle: "dashed" as const,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden" as const,
  },
};

const ImageFormItem = () => {
  const [chooseImage, { data }] = useImagePicker();

  const { showActionSheetWithOptions } = useActionSheet();

  const onAddImage = () => {
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
  };

  return (
    <FormItem name="image">
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
            Take or select photo
          </Text>
        </Stack>
        <Spacer />
        {data?.uri ? (
          <Stack width={160} borderRadius="large" fillHorizontal>
            <Image width={160} height={85} source={{ uri: data?.uri }} />
          </Stack>
        ) : null}
      </Tappable>
    </FormItem>
  );
};

export default ImageFormItem;
