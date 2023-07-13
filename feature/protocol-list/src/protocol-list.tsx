import { Button } from "@immotech-component/button";
import { DataView, EmptyMessage } from "@immotech-component/data-view";
import { ErrorPopup } from "@immotech-component/error-popup";
import { Text } from "@immotech-component/text";
import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { COLOR_X } from "@immotech-feature/theme";
import { CheckmarkCircleIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useNetInfo } from "@react-native-community/netinfo";

type Props = {
  maintenances: string[];
  checkedMaintenances?: Array<number>;
  navigateToMaintenance: (index: number) => void;
  onAddProtocol: () => void;
  protocolLoading: boolean;
  skippedMaintenances?: Array<number>;
  protocolError?: Error | null;
};

export const ProtocolList = React.memo(({
  maintenances,
  checkedMaintenances,
  navigateToMaintenance,
  onAddProtocol,
  protocolLoading,
  skippedMaintenances,
  protocolError,
}: Props) => {
  const { t } = useTranslation();
  const netInfo = useNetInfo();

  const allChecked = checkedMaintenances?.length === maintenances.length;



  const renderItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    return (
      <Stack
        fillHorizontal
        // paddingHorizontal={10}
        padding="horizontal:normal"
        style={{
          borderBottomWidth: 1,
          borderBottomEndRadius: 30,
          borderBottomStartRadius: 30,
          borderBottomColor: COLOR.TERTIARY,
        }}
      >
        <Spacer size="small" />
        <Tappable data={index} onTap={navigateToMaintenance}>
          <Stack horizontal fillHorizontal>
            <Stack width={"90%" as any}>
              <Text bold textColor={COLOR_X.BLACK} fontSize={14}>
                {index + 1}. {item}
              </Text>
            </Stack>
            <Spacer size="x-small"></Spacer>

            {checkedMaintenances?.includes(index) && (
              <Stack alignRight>
                <CheckmarkCircleIcon
                  color={
                    skippedMaintenances?.includes(index)
                      ? COLOR_X.ACCENT7
                      : COLOR.SUCCESS
                  }
                  size={25}
                />
              </Stack>
            )}
          </Stack>
        </Tappable>
        <Spacer size="small" />
      </Stack>
    );
  };

  return (
    <Stack fill>
      <Spinner visible={netInfo.isConnected && netInfo.isInternetReachable === true ? protocolLoading : false} />
      {/* <DataView fill data={maintenances} emptyMessage={<EmptyMessage>{t("main.no_maintenances")}</EmptyMessage>}> */}
      <FlatList
        data={maintenances}
        renderItem={renderItem}
        maxToRenderPerBatch={3}
        initialNumToRender={1}
        ListFooterComponent={<Spacer size="large" />}
        keyExtractor={(item, index) => item + index}
      />
      <Stack
        padding={["vertical:large", "horizontal:normal"]}
        horizontal
        fillHorizontal
        justifyAround
      >
        <Button
          width={225}
          height={45}
          disabled={!allChecked}
          size="small"
          rounded={false}
          textColor={COLOR_X.PRIMARY}
          backgroundColor={COLOR_X.ACCENT}
          onTap={onAddProtocol}
        >
          {t("protocol.send_protocol")}
        </Button>
      </Stack>
      {/* </DataView> */}
      {protocolError ? (
        <ErrorPopup error={protocolError} title="Unable to create protocol" />
      ) : null}
    </Stack>
  );
});
