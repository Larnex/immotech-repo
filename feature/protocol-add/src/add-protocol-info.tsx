import { Text } from "@immotech-component/text";
import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { MaintenanceOpenImageView } from "@immotech-feature/maintenance-open-image";
import { COLOR_X } from "@immotech-feature/theme";
import { CaretBackIcon, CaretForwardIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import FastImage from "react-native-fast-image";

type Props = {
  maintenanceNumber: number;
  maintenance: MaintenanceListResponse;
  maintenanceLength: number;
  onBack: () => void;
  onForward: () => void;
  checkedMaintenances: Set<number>;
  onTodoTap?: (id: string, internalID: string) => void;
  activeMaintenance: MaintenanceListResponse;
};

export const AddProtocolInfo = React.memo(({
  maintenance,
  maintenanceNumber,
  maintenanceLength,
  onBack,
  onForward,
  checkedMaintenances,
  onTodoTap,
  activeMaintenance
}: Props) => {
  const { t } = useTranslation();
  const [showImage, setShowImage] = React.useState(false);

  // const { data: todosData } = useQuery(
  //   `/api/app/todo?parent_id=${activeMaintenance.nid}`, // <-- Fetch function
  //   [`todosbyMaintenance:${activeMaintenance.nid}`], // <-- Unique cache key for each maintenance
  //   {
  //     enabled: true, // Make sure the query runs
  //   }
  // );

  // // Filter the todos based on their status
  // const openOrInProgressTodos = todosData
  //   ? (todosData)?.filter(
  //     (todo: ToDoListResponse) => todo.status === 'open' || todo.status === 'in_progress'
  //   )
  //   : [];
  // // Calculate the number of todos with 'open' or 'in_progress' status
  // const numberOfTodos = openOrInProgressTodos.length;


  return (
    <Stack
      style={{
        borderWidth: 3,
        borderRadius: 25,
      }}
      borderColor={
        checkedMaintenances.has(maintenanceNumber - 1)
          ? COLOR.SUCCESS
          : COLOR.WARNING
      }
      padding={"small"}
      paddingBottom={30}
    >
      <Stack alignCenter>
        <Spacer size="small" />


        <Stack alignMiddle horizontal>
          <Stack paddingRight={10}>
            <Tappable onTap={onBack}>
              <CaretBackIcon color={COLOR_X.BLACK} />
            </Tappable>
          </Stack>
          {/* <Spacer size="small"></Spacer> */}

          <Text
            textColor={COLOR_X.BLACK}
            semiBold
            fontSize={18}
            style={{ width: "70%" }}
            alignCenter
          >
            {maintenance.name ? maintenance.name : maintenance.title}
          </Text>
          {/* <Spacer size="small"></Spacer> */}
          <Stack paddingLeft={10}>
            <Tappable onTap={onForward}>
              <CaretForwardIcon color={COLOR_X.BLACK} />
            </Tappable>
          </Stack>
        </Stack>
        <Spacer size="x-small" />
        <Text textColor={COLOR_X.BLACK} semiBold fontSize={18}>
          ({maintenanceNumber}/{maintenanceLength})
        </Text>
      </Stack>

      <Spacer size="normal" />

      <Stack>
        <Stack horizontal fillHorizontal justifyAround>
          <Stack width={"50%" as any}>
            <Text textColor={COLOR_X.BLACK}>
              {t("tga.type")}: {maintenance.type}
            </Text>
            <Spacer size="x-small" />

            <Text textColor={COLOR_X.BLACK}>
              {t("protocol.localization")}:{" "}
              {maintenance.location ? maintenance.location : "No Location"}
            </Text>
            <Spacer size="x-small" />
          </Stack>
          {maintenance.images ? (
            <Stack alignMiddle>
              <Tappable onTap={() => setShowImage(true)}>
                <FastImage
                  style={{ width: 85, height: 85, borderRadius: 10 }}
                  source={{ uri: maintenance.images[0], priority: FastImage.priority.normal }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </Tappable>
            </Stack>
          ) : null}


        </Stack>
        <Spacer size="small" />
        {/* <Stack alignMiddle alignCenter>
          <Tappable onTap={() => onTodoTap!(maintenance?.nid!, maintenance?.name! ?? maintenance?.title!)}>
            <Stack
              style={{
                backgroundColor: "#6C63FF",
                borderRadius: 10,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text textColor={COLOR_X.PRIMARY} semiBold>
                {`${t("main.active_todos")}: ${numberOfTodos}`}
              </Text>
            </Stack>
          </Tappable>
        </Stack> */}
      </Stack>

      <MaintenanceOpenImageView
        show={showImage}
        onDismiss={() => setShowImage(false)}
        imgUrls={
          !!maintenance?.images
            ? maintenance?.images.map((item: any) => {
              return {
                url: item,
              };
            })
            : []
        }
      ></MaintenanceOpenImageView>
    </Stack>
  );
});

