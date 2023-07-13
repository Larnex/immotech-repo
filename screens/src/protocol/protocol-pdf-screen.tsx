import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { ProtocolPdfList } from "@immotech-feature/protocol-pdf-list";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { Screens } from "../navigation/screens";

export type ProtocolPdfParamsList = {
  [Screens.ProtocolPdfList]: {
    id: string;
    internalID?: string;
    title?: string;
    object?: "property" | "unit";
  };
};




const ProtocolPdfScreen = () => {
  const { params } = useRoute<RouteProp<ProtocolPdfParamsList>>();

  const { navigate, push } = useNavigation<any>();

  const { id, internalID, title, object } = params ?? {};
  const navigateToProtocolPdfView = (uri: string, title: string) => {
    navigate(Screens.ProtocolPdfView, {
      uri,
      title,
    });
  };

  return (
    <Screen withSafeArea>

      {(!id && !internalID) && (
        <Stack>

          <PageHeader
            accentColor={COLOR_X.MAINTENANCE_HEADER}
            showBackButton={!!id}
            hideGlobalSearch
          >
            <Stack alignCenter>
              <Text
                semiBold
                alignCenter
                fontSize="x-large"
                textColor={COLOR_X.PRIMARY}
              >
                Protocols of {title} (ID: {id})
              </Text>
            </Stack>
          </PageHeader>
        </Stack>
      )}

      <Stack alignCenter fill>
        <ProtocolPdfList
          parentId={id}
          internalID={internalID}
          onSelect={navigateToProtocolPdfView}
          type={object}
        ></ProtocolPdfList>
      </Stack>
    </Screen>
  );
};

export default ProtocolPdfScreen;
