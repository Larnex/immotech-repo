import { Stack } from "native-x-stack";
import React from "react";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

import { HeaderButton } from "@immotech-component/page-header";
import { ArrowBackIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { COLOR } from "native-x-theme";


interface Props {
  show: boolean;
  onDismiss: () => void;
  imgUrls?: {
    url: string;
  }[];
}

export const MaintenanceOpenImageView = ({
  show,
  onDismiss,
  imgUrls,
}: Props) => {

  return (
    <Stack>
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
    </Stack>
  );
};
