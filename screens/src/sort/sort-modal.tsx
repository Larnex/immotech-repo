import { BottomSheet } from "@immotech-component/bottom-sheet";
import { Button } from "@immotech-component/button";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-native";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";

type SortModalParamList = {
  [Modals.Sort]: {
    target?: Screens;
    byNumber?: boolean;
    byName?: boolean;
    byZip?: boolean;
    byCity?: boolean;

    byToDoName?: boolean;
    byCostHigh?: boolean;
    byCostLow?: boolean;
    byUrgency?: boolean;
    byStatus?: boolean;

    byMaintenanceName?: boolean;
    byType?: boolean;
    byDateStart?: boolean;
    byDateEnd?: boolean;
  };
};

export function SortModal() {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<SortModalParamList>>();

  const [visible, open] = useOpenClose(true);
  const { navigate, goBack } = useNavigation<any>();

  const [byNumber, setByNumber] = useState(params.byNumber);


  const [byName, setByName] = useState(params.byName);
  const [byZip, setByZip] = useState(params.byZip);
  const [byCity, setByCity] = useState(params.byCity);

  const [byToDoName, setByToDoName] = useState(params.byToDoName);
  const [byCostHigh, setByCostHigh] = useState(params.byCostHigh);
  const [byCostLow, setByCostLow] = useState(params.byCostLow);

  const [byMaintenanceName, setByMaintenanceName] = useState(params.byMaintenanceName);
  const [byDateStart, setByDateStart] = useState(params.byDateStart);
  const [byDateEnd, setByDateEnd] = useState(params.byDateEnd);
  const [byType, setByType] = useState(params.byType);

  const [byUrgency, setByUrgency] = useState(params.byUrgency);
  const [byStatus, setByStatus] = useState(params.byStatus);

  const sortOptions = () => {
    switch (params?.target?.toString()) {
      case "ENTITIES_HOME":
        return {
          name: Screens.EntitiesHome,
          params: {
            byNumber,
            byName,
            byZip,
            byCity,
          },
          merge: true,
        };
      case "PROPERTIES_HOME":
        return {
          name: Screens.PropertiesHome,
          params: {
            byNumber,
            byName,
            byZip,
            byCity,
          },
          merge: true,
        };

      case "TODOS_HOME": {
        return {
          name: Screens.ToDosHome,
          params: {
            byToDoName,
            byCostHigh,
            byCostLow,
            byUrgency,
            byStatus,
          },
          merge: true,
        };
      }

      case "MAINTENANCE_HOME": {
        return {
          name: Screens.MaintenanceHome,
          params: {
            byMaintenanceName,
            byDateStart,
            byDateEnd,
            byType,
          },
          merge: true,
        };
      }
    }
  };

  const onTapSortResult = React.useCallback(() => {
    navigate(sortOptions());
  }, [
    byNumber,
    byName,
    byZip,
    byCity,
    byToDoName,
    byCostHigh,
    byCostLow,
    byUrgency,
    byStatus,
    byMaintenanceName,
    byDateStart,
    byDateEnd,
    byType,
  ]);

  const Toggle = ({
    value,
    onValueChange,
    label,
  }: {
    value?: boolean;
    onValueChange: (value: boolean) => void;
    label: string;
  }) => {
    return (
      <Stack
        horizontal
        fillHorizontal
        alignCenter
        padding={["horizontal:normal", "vertical:normal"]}
      >
        <Text textColor={COLOR_X.BLACK}>{label}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          ios_backgroundColor="#3e3e3e"
          value={value}
          onValueChange={onValueChange}
        />
      </Stack>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={goBack} snapPoints={[400]}>
      <Stack fill padding={["horizontal:normal", "vertical:normal"]}>
        {params?.target?.toString() === "ENTITIES_HOME" ||
          params?.target?.toString() === "PROPERTIES_HOME" ? (
          <>
            <Toggle
              label={`${t("sort.byNumber")}`}
              onValueChange={() => {
                setByNumber((previousState) => !previousState);
                setByCity(false);
                setByName(false);
                setByZip(false);
              }}
              value={byNumber}
            />

            <Toggle
              label={`${t("sort.byName")}`}
              onValueChange={() => {
                setByName((previousState) => !previousState);
                setByNumber(false);
                setByZip(false);
                setByCity(false);
              }}
              value={byName}
            />

            <Toggle
              label={`${t("sort.byCity")}`}
              onValueChange={() => {
                setByCity((previousState) => !previousState);
                setByNumber(false);
                setByName(false);
                setByZip(false);
              }}
              value={byCity}
            />

            <Toggle
              label={`${t("sort.byZipCode")}`}
              onValueChange={() => {
                setByZip((previousState) => !previousState);
                setByCity(false);
                setByName(false);
                setByNumber(false);
              }}
              value={byZip}
            />
            <Spacer size="normal" />
          </>
        ) : params?.target?.toString() === "TODOS_HOME" ? (
          <>
            <Toggle label={`${t("sort.byName")}`} onValueChange={() => {
              setByToDoName((previousState) => !previousState);
              setByCostHigh(false);
              setByCostLow(false);
              setByUrgency(false);
              setByStatus(false);
            }} value={byToDoName}></Toggle>
            <Toggle
              label={`${t("sort.byCostHigh")}`}
              onValueChange={() => {
                setByCostHigh((previousState) => !previousState);
                setByToDoName(false);
                setByUrgency(false);
                setByStatus(false);
                setByCostLow(false);
              }}
              value={byCostHigh}
            ></Toggle>
            <Toggle
              label={`${t("sort.byCostLow")}`}
              onValueChange={() => {
                setByCostLow((previousState) => !previousState);
                setByToDoName(false);
                setByUrgency(false);
                setByStatus(false);
                setByCostHigh(false);
              }}
              value={byCostLow}
            ></Toggle>
            <Toggle
              label={`${t("sort.byUrgency")}`}
              onValueChange={() => {
                setByUrgency((previousState) => !previousState);
                setByToDoName(false);
                setByCostHigh(false);
                setByCostLow(false);
                setByStatus(false);
              }}
              value={byUrgency}
            ></Toggle>
            <Toggle
              label={`${t("sort.byStatus")}`}
              onValueChange={() => {
                setByStatus((previousState) => !previousState);
                setByToDoName(false);
                setByCostHigh(false);
                setByCostLow(false);
                setByUrgency(false);
              }}
              value={byStatus}
            ></Toggle>
          </>
        ) : params?.target?.toString() === "MAINTENANCE_HOME" ? (
          <>
            <Toggle
              label={`${t("sort.byName")}`}
              onValueChange={() => {
                setByMaintenanceName((previousState) => !previousState);
                setByDateStart(false);
                setByDateEnd(false);
                setByType(false);
              }}
              value={byMaintenanceName}
            ></Toggle>


            <Toggle
              label={`${t("sort.byDateInstallNew")}`}
              value={byDateStart}
              onValueChange={() => {
                setByDateStart((previousState) => !previousState);
                setByMaintenanceName(false);
                setByDateEnd(false);
                setByType(false);
              }}
            ></Toggle>

            <Toggle
              label={`${t("sort.byDateInstallOld")}`}
              value={byDateEnd}
              onValueChange={() => {
                setByDateEnd((previousState) => !previousState);
                setByMaintenanceName(false);
                setByDateStart(false);
                setByType(false);
              }}
            ></Toggle>

            <Toggle
              label={`${t("sort.byType")}`}
              value={byType}
              onValueChange={() => {
                setByType((previousState) => !previousState);
                setByMaintenanceName(false);
                setByDateStart(false);
                setByDateEnd(false);
              }}
            ></Toggle>
          </>
        ) : (
          <></>
        )}

        <Stack fillHorizontal>
          <Button height={48} rounded={false} onTap={onTapSortResult}>
            {t("sort.applySorting")}
          </Button>
        </Stack>
      </Stack>
    </BottomSheet>
  );
}
