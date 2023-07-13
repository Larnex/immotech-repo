import { HeaderButton } from "@immotech-component/page-header";
import { ArrowBackIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

interface Props {
  show: boolean;

  //   TODO: add single todo response type
  todo?: any;
  onDismiss: () => void;
  imgUrls?: {
    url: string;
  }[];
}

export const ToDoOpenImageView = ({
  show,
  todo,
  onDismiss,
  imgUrls,
}: Props) => {
  return (
    <Stack>
      {todo?.field_todo_pictures!.und && (
        <Modal visible={show} transparent={true} onRequestClose={onDismiss}>
          <ImageViewer
            renderHeader={() => (
              <Stack
                horizontal
                alignCenter
                alignMiddle
                style={{ position: "relative", zIndex: 100 }}
                padding={["horizontal:small"]}
              >
                <Stack fill overflowVisible>
                  <Spacer size="normal" />
                  <Spacer size="xx-small" />

                  <HeaderButton onTap={onDismiss}>
                    <ArrowBackIcon color={COLOR.PRIMARY} />
                  </HeaderButton>
                </Stack>
              </Stack>
            )}
            imageUrls={imgUrls as any}
          />
        </Modal>
      )}
    </Stack>
  );
};
