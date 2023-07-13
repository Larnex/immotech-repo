import { HeaderButton } from "@immotech-component/page-header";
import { PropertyDataType } from "@immotech-feature/property-api";
import { ArrowBackIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

interface Props {
  show: boolean;
  property?: PropertyDataType;
  onDismiss: () => void;
  propertyOnline: boolean | null;
}

export const PropertyOpenImageView = ({ show, property, onDismiss, propertyOnline }: Props) => {
  return (
    <Stack>
      {property?.field_property_overview_picture && (
        <Modal visible={show} transparent={true} onRequestClose={onDismiss}>
          {!Array.isArray(property?.field_property_overview_picture) && (
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
            imageUrls={[
              {
                url: propertyOnline ? `https://immotech.cloud/system/files/${
                  property?.field_property_overview_picture!.und[0].filename
                }` : `data:image/png;base64,${property?.field_property_overview_picture}`
              },
            ]}
          />
          )}
        </Modal>
      )}
    </Stack>
  );
};
