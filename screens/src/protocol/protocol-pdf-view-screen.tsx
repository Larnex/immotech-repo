import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
// import { checkDownloadPermission } from "@immotech/util";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-native";
import Pdf from "react-native-pdf";
import { Screens } from "../navigation/screens";
import { downloadAndOpenPdfFile } from "./download-pdf";
import { DownloadIcon } from "native-x-icon";
import { Tappable } from "native-x-tappable";

type ProtocolPdfViewParamsList = {
  [Screens.ProtocolPdfView]: {
    uri: string;
    title: string;
    isProtocolNew?: boolean;
    parentId?: string
  };
};

const ProtocolPdfViewScreen = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ProtocolPdfViewParamsList>>();

  const { uri, title, isProtocolNew, parentId } = params ?? {};

  const { goBack, navigate } = useNavigation<any>();

  const goBackToProtocolCreation = () => {
    goBack();
  }

  const confirmChangesAndGoBack = () => {
    navigate(Screens.PropertyDetails, {
      id: parentId
    })
  }

  const downloadPDFTap = async () => {
    await downloadAndOpenPdfFile(uri, title)
  }

  return (
    <Screen withSafeArea>
      {!isProtocolNew ? (
        <Stack>

          <PageHeader accentColor={COLOR_X.BLACK} showBackButton hideGlobalSearch={true}>
            <Stack alignCenter fillHorizontal alignMiddle>
              <Stack fillHorizontal alignCenter alignMiddle>
                <Tappable onTap={downloadPDFTap} >
                  <DownloadIcon size={30} color={COLOR_X.BLACK} />
                </Tappable>
                <Text>{t("protocol.download_pdf")}</Text>
              </Stack>
            </Stack>
          </PageHeader>
        </Stack>
      ) : (
        <Stack>
          <Spacer />
          <Spacer />
        </Stack>
      )}

      <Stack alignCenter fill>
        <Pdf
          trustAllCerts={false}
          enablePaging={true}
          key={uri}
          source={{ uri: uri }}
          style={{ flex: 1, width: "100%", height: "100%" }}
          onPressLink={(uri) => {

          }}
        />

        {isProtocolNew && (
          <Stack style={{ flexDirection: "row", margin: 10 }} padding={["small"]} >
            <Stack style={{ flex: 1, margin: 5 }}>
              <Button title={`${t("protocol.edit_protocol")}`} onPress={goBackToProtocolCreation} />
            </Stack>
            <Stack style={{ flex: 1, margin: 5 }}>
              <Button title={`${t("protocol.confirm_changes")}`} onPress={confirmChangesAndGoBack} />
            </Stack>
          </Stack>
        )}


      </Stack>
    </Screen>
  );
};

export default ProtocolPdfViewScreen;
