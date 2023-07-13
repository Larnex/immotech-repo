import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { MaintenanceListResponse, useMaintenanceById } from "@immotech-feature/maintenance-api";
import {
  ProtocolDataType,
  useAddProtocol,
  ProtocolsInsideProperty
} from "@immotech-feature/protocol-api";
import { ProtocolList } from "@immotech-feature/protocol-list";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { Screens } from "../navigation/screens";
import { useNetInfo } from "@react-native-community/netinfo";


type ProtocolListParamsList = {
  [Screens.ProtocolList]: {
    id: string;
    checkedMaintenances?: Array<number>;
    skippedMaintenances?: Array<number>;
    maintenances: string[];
    maintenanceLoading?: boolean;
    title?: string;
    selectMaintenance: (index: number) => void;
    protocols?: Set<ProtocolDataType>;
    object?: "property" | "unit";
  };
};

export const ProtocolListScreen = React.memo(() => {
  // const {data: maintenances, isLoading: maintenanceLoading} = useMaintenanceById({nid: id, internalID: internalID})
  const { t } = useTranslation();

  const netInfo = useNetInfo();

  const { navigate, goBack } = useNavigation<any>();
  const { params } = useRoute<RouteProp<ProtocolListParamsList>>();

  const { mutate: addProtocol, isLoading, error } = useAddProtocol();

  const {
    id,
    checkedMaintenances,
    maintenances,
    selectMaintenance,
    protocols,
    skippedMaintenances,
    object,
  } = params ?? {};


  // const selectMaintenance = (index: any) => {
  //   if (carouselRef && carouselRef.current) {
  //     carouselRef.current.snapToItem(index);
  //   }
  // };

  const navigateToMaintenance = React.useCallback(
    (index: number) => {


      selectMaintenance(index);
      goBack();
    },
    [navigate]
  );

  const navigateToProtocolPdf = React.useCallback(() => {
    navigate(Screens.ProtocolPdfList, { id, object });
  }, [navigate]);

  const onAddProtocolTap = () => {
    if (protocols?.size === 0) {
      console.error("No protocols to add");

      return;
    }

    Alert.alert("Want to add protocol?", "Are you sure?", [
      {
        text: `${t("main.cancel")}`,
      },
      {
        text: "OK",
        onPress: () => {
          addProtocol({
            field_tp_assignment: id,
            field_tp_line_items: {
              und: [...protocols!] as ProtocolDataType[],
            },
          }, {
            onSuccess: async (data, variables, context) => {
              try {
                // Step 1: Retrieve the parent property
                const propertyResponse = await fetch(`https://immotech.cloud/api/app/property/${variables.field_tp_assignment}`);
                const propertyData = await propertyResponse.json();
                // Step 2: Retrieve the protocols using data.uri link
                const protocolResponse = await fetch(data.uri);
                const protocols = await protocolResponse.json();

                // Step 3: Select the protocol with the same timestamp
                const creationTimestamp = protocols.created; // Retrieve creation timestamp of the new protocol
                // Step 3: Select the protocol with the same timestamp
                const selectedProtocol = propertyData.field_test_protocols.und.find((protocol: ProtocolsInsideProperty) => {
                  return protocol.timestamp === creationTimestamp;
                });

                if (!selectedProtocol) {
                  console.error('Could not find matching protocol');
                  return;
                }

                // Step 4: Navigate to ProtocolPdfViewScreen with the selected protocol's URL and filename
                navigate(Screens.ProtocolPdfView, {
                  uri: selectedProtocol.url, // Assuming 'url' key holds the URI
                  title: selectedProtocol.filename, // Assuming 'filename' key holds the title
                  isProtocolNew: true,
                  parentId: variables.field_tp_assignment
                });

              } catch (error) {
                console.error('Error retrieving data:', error);
              }

            },
          });

          if (!netInfo.isConnected || netInfo.isInternetReachable === false) {
            goBack();
            goBack();
          }

        },
      },
    ]);
  };

  return (
    <Screen withSafeArea>
      <Stack>
        <PageHeader
          accentColor={COLOR_X.PRIMARY}
          showBackButton
          backButtonColor={COLOR_X.ACCENT}
          hideGlobalSearch
        >
          <Stack>
            <Text
              bold
              alignCenter
              fontSize="x-large"
              textColor={COLOR_X.ACCENT}
            >
              {t("protocol.protocol_creation")}
            </Text>
          </Stack>
        </PageHeader>
      </Stack>
      <Stack
        alignCenter
        fill
        backgroundColor={COLOR.PRIMARY}
        padding={["vertical:large"]}
      >
        <ProtocolList
          navigateToMaintenance={navigateToMaintenance}
          maintenances={maintenances}
          checkedMaintenances={checkedMaintenances}
          skippedMaintenances={skippedMaintenances}
          onAddProtocol={onAddProtocolTap}
          protocolLoading={isLoading}
          protocolError={error}
        />
      </Stack>
    </Screen>
  );
});



