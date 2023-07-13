import { BottomSheet } from "@immotech-component/bottom-sheet";
import { Button } from "@immotech-component/button";
import { DatePicker } from "@immotech-component/date-picker";
import { FilterIcon } from "@immotech-component/icons";
import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { useMepTypes } from "@immotech-feature/maintenance-api";
import { ThreeDModels } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";

const ONE_MONTH_AGO = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000);
const TODAY = new Date();

type FilterModalParamList = {
  [Modals.Filters]: {
    target?: Screens;
    status?: string;
    urgency?: string;
    startDate?: string;
    endDate?: string;
    type?: string;

    modelType?: string;
    timestamp: number[];
    selectedTimestamp?: number;

    models?: ThreeDModels[];

    object?: "property" | "unit"
  };
};

export function FiltersModal() {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<FilterModalParamList>>();

  const [models, setModels] = React.useState<ThreeDModels[] | undefined>(
    params.models!
  );
  const { data: mepTypes, isLoading } = useMepTypes();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [visible, open] = useOpenClose(true);
  const { navigate, goBack } = useNavigation<any>();
  const [status, setStatus] = React.useState(params.status);
  const [maintenanceType, setMaintenanceType] = React.useState(mepTypes);

  const [type, setType] = React.useState(params.type);
  const [timestamp, setTimestamp] = React.useState(params.selectedTimestamp);

  const [modelType, setModelType] = React.useState();

  const [urgency, setUrgency] = React.useState(params.urgency);
  const [startDate, setStartDate] = React.useState(
    params.startDate ? new Date(params.startDate) : ONE_MONTH_AGO
  );
  const [endDate, setEndDate] = React.useState(
    params.endDate ? new Date(params.endDate) : TODAY
  );

  useEffect(() => {
    if (params.target?.toString() == "MAINTENANCE_HOME") {
      setMaintenanceType(mepTypes);
    }
  }, [mepTypes, isLoading]);

  useEffect(() => {
    if (params.target?.toString() == "THREE_D_HOME") {
      setModels(params.models!);
    }
  }, [params.models]);

  const statuses: any = {
    open: "Status: Open 🔴",
    in_progress: "Status: In Process 🟡",
    done: "Status: Completed 🟢",
  };

  const urgencies = {
    short: "Short-term",
    middle: "Medium-term",
    long: "Long-term",
    none: "Not urgent",
  };

  const timestamps = () => {
    if (params.timestamp) {
      const timestampSet = new Set([...params.timestamp]);

      if (modelType) {
        const timestampPickArray = (models ?? [])
          .filter((item) => item.type == modelType)
          .map((item) => {
            return {
              label: new Date(item.timestamp * 1000).toLocaleString("en-GB", {
                timeZone: "UTC",
              }),

              value: item.timestamp,
            };
          });

        return timestampPickArray;
      } else {
        const timestampPickArray = Array.from(timestampSet).map((timestamp) => {
          return {
            label: new Date(timestamp * 1000).toLocaleString("en-GB", {
              timeZone: "UTC",
            }),
            value: timestamp,
          };
        });

        return timestampPickArray;
      }
    } else {
      return [];
    }
  };

  const modelTypes = () => {
    if (params.modelType) {
      const modelTypesSet = new Set(
        (models ?? []).map((item) => {
          return item.type;
        })
      );
      const modelTypesPickArray = Array.from(modelTypesSet).map((type) => {
        return {
          // label: type.charAt(0).toUpperCase() + type.slice(1),
          label: `${t(`model_types.${type}`)}`,
          value: type,
        };
      });

      return modelTypesPickArray;
    } else {
      return [];
    }
  };

  const timestampPick = useMemo(
    () => timestamps(),
    [params.timestamp, modelType]
  );

  const modelPick = useMemo(() => modelTypes(), [params.modelType]);

  const statusPick = useMemo(
    () =>
      Object.entries(statuses ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [statuses]
  );

  const typePick = useMemo(
    () =>
      Object.entries(maintenanceType ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[1].toString().split("(")[1].replace(")", ""),
        };
      }),
    [maintenanceType]
  );

  const urgencyPick = useMemo(
    () =>
      Object.entries(urgencies ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),
    [urgencies]
  );

  const filterOptions = () => {
    switch (params?.target?.toString()) {
      case "TODOS_HOME":
        return {
          name: Screens.ToDosHome,
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status,
            urgency,
          },
          merge: true,
        };
      case "MAINTENANCE_HOME":
        return {
          name: Screens.MaintenanceHome,
          params: {
            type,
          },

          merge: true,
        };
      case "THREE_D_VIEW":
        return {
          name: params.object === "unit" ? Screens.UnitDetails : Screens.PropertyDetails,
          params: {
            modelType: modelType,
            timestamp: timestamp,
          },
          merge: false,
        };
    }
  };

  const onTapFilterResults = React.useCallback(() => {
    navigate(filterOptions());
  }, [
    endDate,
    status,
    urgency,
    navigate,
    params?.target,
    startDate,
    type,
    modelType,
    timestamp,
  ]);

  useEffect(() => {
    open();
  }, [open]);

  return (
    <BottomSheet visible={visible} onClose={goBack} snapPoints={[550]}>
      {params?.target?.toString() == "TODOS_HOME" ? (
        <Stack fill padding="horizontal:large" alignLeft minHeight={550}>
          <Spacer />
          <Stack horizontal alignCenter fillHorizontal>
            <FilterIcon />
            <Spacer size="small" />
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("filter.select_filters")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer />
          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("filter.start_date")}
          </Text>
          <Spacer size="x-small" />
          <DatePicker value={startDate} onChange={setStartDate} />
          <Spacer size="small" />
          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("filter.end_date")}
          </Text>
          <Spacer size="x-small" />
          <DatePicker value={endDate} onChange={setEndDate} />
          <Spacer size="small" />
          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            Status
          </Text>
          <Spacer size="x-small" />
          <Picker
            items={statusPick}
            value={status}
            onChange={setStatus}
            placeholder={`${t("todo.details.select_status")}`}
          />
          <Spacer size="x-small" />

          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("todo.list.urgency")}
          </Text>
          <Spacer size="x-small" />

          <Picker
            items={urgencyPick}
            value={urgency}
            onChange={setUrgency}
            placeholder={`${t("todo.add.choose_urgency")}`}
          />
          <Spacer size="small" />
          <Stack fillHorizontal>
            <Button height={48} rounded={false} onTap={onTapFilterResults}>
              {t("filter.apply_filters")}
            </Button>
          </Stack>
        </Stack>
      ) : params?.target?.toString() == "MAINTENANCE_HOME" ? (
        <Stack fill padding="horizontal:large" alignLeft minHeight={550}>
          <Spacer />
          <Stack horizontal alignCenter fillHorizontal>
            <FilterIcon />
            <Spacer size="small" />
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("filter.select_filters")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer />

          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("tga.type")}
          </Text>
          <Spacer size="x-small" />

          <DropDownPicker
            open={dropdownOpen}
            value={type}
            items={typePick}
            setValue={setType}
            setOpen={setDropdownOpen}
            searchable={true}
            textStyle={{ fontSize: 16, color: COLOR.SECONDARY }}
            placeholder={`${t("todo.add.select_type")}`}
            placeholderStyle={{ fontSize: 16, color: "#aaa" }}
            maxHeight={300}
            listMode="MODAL"
            style={{
              borderColor: "#4673FF",
              backgroundColor: "#fff",
            }}
            labelStyle={{
              fontSize: 16,
              color: "#4673FF",
              paddingHorizontal: 10,
            }}
            listItemLabelStyle={{
              fontSize: 16,
              color: "#4673FF",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#fff",
              borderColor: "#4673FF",
              borderRadius: 8,
            }}
            listItemContainerStyle={{
              marginVertical: 4,
              marginHorizontal: 8,
              paddingHorizontal: 10,
              borderRadius: 8,
            }}
            customItemContainerStyle={{
              backgroundColor: "#e6f0ff",
            }}

            customItemLabelStyle={{
              color: "#3058d6",

            }}
            searchContainerStyle={{
              borderBottomColor: "transparent"

            }}

            searchTextInputStyle={{
              paddingHorizontal: 10,
              borderColor: "transparent"
            }}
            modalProps={{
              animationType: "slide",
            }}
          />

          <Spacer size="x-small" />

          <Spacer size="small" />
          <Stack fillHorizontal>
            <Button height={48} rounded={false} onTap={onTapFilterResults}>
              {t("filter.apply_filters")}
            </Button>
          </Stack>
        </Stack>
      ) : params?.target?.toString() == "THREE_D_VIEW" ? (
        <Stack fill padding="horizontal:large" alignLeft minHeight={550}>
          <Spacer />
          <Stack horizontal alignCenter fillHorizontal>
            <FilterIcon />
            <Spacer size="small" />
            <Text semiBold alignCenter textColor={COLOR_X.ACCENT5}>
              {t("filter.select_filters")}
            </Text>
            <Spacer size="small" />
          </Stack>
          <Spacer />

          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("model.model_type")}
          </Text>
          <Spacer size="x-small" />

          <Picker
            items={modelPick}
            value={modelType}
            onChange={setModelType}
            placeholder={`${t("model.model_type")}`}
          />
          <Spacer size="x-small" />

          <Spacer size="x-small" />
          <Text alignCenter textColor={COLOR_X.ACCENT5}>
            {t("filter.select_time")}
          </Text>
          <Spacer size="x-small" />

          <Picker
            items={timestampPick}
            value={timestamp}
            onChange={setTimestamp}
            placeholder={`${t("filter.select_time")}`}
          />
          <Spacer size="x-small" />

          <Spacer size="small" />
          <Stack fillHorizontal>
            <Button height={48} rounded={false} onTap={onTapFilterResults}>
              {t("filter.apply_filters")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack></Stack>
      )}
    </BottomSheet>
  );
}
