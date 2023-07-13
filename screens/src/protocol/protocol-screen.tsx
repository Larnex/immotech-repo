import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { MaintenanceListResponse, useMaintenanceById } from "@immotech-feature/maintenance-api";
import { AddProtocol } from "@immotech-feature/protocol-add";
import { ProtocolDataType } from "@immotech-feature/protocol-api";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { ListIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View } from "react-native";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { Screens } from "../navigation/screens";

export type ProtocolScreensParamList = {
  [Screens.ProtocolScreen]: {
    id?: string;
    internalID?: string;
    title?: string;
    object?: "property" | "unit";
    newProtocol?: boolean;
  };
};

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("screen").height;

function ProtocolScreenComponent() {

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { navigate, push } = useNavigation<any>();
  const route = useRoute<RouteProp<ProtocolScreensParamList, Screens.ProtocolScreen>>();
  const { id, internalID, title, object, newProtocol } = route.params || {};
  const carouselRef = useRef<ICarouselInstance>(null);
  const { data, isLoading } = useMaintenanceById({ nid: id, internalID: internalID ?? id, object });

  const [maintenanceIndex, setMaintenanceIndex] = useState<number | undefined>(undefined);
  const [activeMaintenance, setActiveMaintenance] = useState<MaintenanceListResponse | undefined>(undefined);
  const [checkedMaintenances, setCheckedMaintenances] = useState<Set<number>>(new Set());
  const [skippedMaintenances, setSkippedMaintenances] = useState<Set<number>>(new Set());
  const [protocol, setProtocol] = useState<Set<ProtocolDataType>>(new Set());
  console.log("🚀 ~ file: protocol-screen.tsx:48 ~ ProtocolScreen ~ protocol:", protocol);
  const [isNavigating, setIsNavigating] = useState(false);
  const maintenanceNamesOrTitles = data?.map(maintenance =>
    maintenance.name || maintenance.title
  );

  const [isVertical, setIsVertical] = React.useState(false);
  const [isPagingEnabled, setIsPagingEnabled] = React.useState(true);
  const [currentHeight, setCurrentHeight] = React.useState(PAGE_HEIGHT);

  const baseOptions = isVertical
    ? ({
      vertical: true,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
    } as const)
    : ({
      vertical: false,
      width: PAGE_WIDTH,
    } as const);


  // useEffect(() => {
  //   setProtocol(new Set());
  //   setCheckedMaintenances(new Set());
  //   setSkippedMaintenances(new Set());
  // }, []);

  // const selectMaintenance = (index: any) => {
  //   if (carouselRef && carouselRef.current) {
  //     carouselRef.current.snapToItem(index);
  //   }
  // };



  // useEffect(() => {
  //   if (maintenanceIndex !== undefined) {
  //     setTimeout(() => {
  //       selectMaintenance(maintenanceIndex + 1);
  //     }, 500)
  //   }
  // }, [maintenanceIndex]);


  const onPushProtocol = React.useCallback((addedProtocol: ProtocolDataType, skipped?: boolean, maintenanceNumber?: number, imagesArray?: any[]) => {
    console.log("🚀 ~ file: protocol-screen.tsx:96 ~ onPushProtocol ~ addedProtocol:", addedProtocol);
    console.log("ON PUSH PROTOCOL");
    const activeIndex = maintenanceNumber ? maintenanceNumber - 1 : maintenanceIndex;

    if (activeIndex === undefined) {
      console.error("Both maintenanceNumber and maintenanceIndex are undefined.");
      return;
    }

    if (maintenanceNumber) {
      setMaintenanceIndex(activeIndex);
    }

    setCheckedMaintenances((prev) => new Set([...prev, activeIndex!]));

    setSkippedMaintenances((prev) => {
      const updatedSkippedMaintenances = new Set(prev);
      if (skipped) {
        if (updatedSkippedMaintenances.has(activeIndex!)) {
          return prev;
        } else {
          updatedSkippedMaintenances.add(activeIndex!);
        }
      } else {
        updatedSkippedMaintenances.delete(activeIndex!);
      }
      return updatedSkippedMaintenances;
    });

    setProtocol((prev) => {
      const updatedProtocol = new Set(prev);
      let itemExists = false;

      for (const item of updatedProtocol) {
        if (item.field_tp_maintenance_obj === addedProtocol.field_tp_maintenance_obj) {
          itemExists = true;
          updatedProtocol.delete(item);

          if (!skipped) {
            updatedProtocol.add(addedProtocol);
          }

          break;
        }
      }

      if (!itemExists && !skipped) {
        updatedProtocol.add(addedProtocol);
      }
      // onNext();

      // queryClient.setQueryData([`protocol:${addedProtocol.field_tp_maintenance_obj}`], { description: addedProtocol.field_tp_diagnosis?.und?.[0]?.value, fix: addedProtocol.field_tp_action?.und?.[0]?.value, status: addedProtocol.field_tp_line_item_status?.und, imagesArray: imagesArray, skipEnabled: skipped })


      carouselRef.current?.next();
      return updatedProtocol;
    });

    if (maintenanceNumber == null) {
      carouselRef.current?.next();
    }
  }, []);



  const onPrev = React.useCallback(() => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.prev();
    }
  }, [carouselRef]);

  const onNext = React.useCallback(() => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.next();
    }
  }, [carouselRef]);

  // const [dataLength, setDataLength] = React.useState<number>(0);
  // const [enhancedMaintenances, setEnhancedMaintenances] = React.useState<MaintenanceListResponse[] | []>([]);



  React.useEffect(() => {
    if (newProtocol && data) {
      // iterate through data to retrieve maintenance's id and delete protocols from the cache by this ids
      data.forEach((item) => {
        queryClient.removeQueries([`protocol:${item.nid}`]);
      }
      )

    }
  }, [newProtocol, data]);

  const countTodosForMaintenances = (maintenances: MaintenanceListResponse[]) => {
    return maintenances.map((maintenance: MaintenanceListResponse) => {
      // Replace the following line with the actual logic to find todos for each maintenance
      const todosItem = queryClient.getQueryData([`todosbyMaintenance:${maintenance.nid}`]) as any; // Example query
      // Filter out todos with status === "done"
      const notDoneTodos = todosItem?.filter((todo: any) => todo.status !== "done") ?? [];
      const todosAmount = notDoneTodos.length;
      return {
        ...maintenance,
        todosAmount
      }
    });
  };

  // const enhancedMaintenances = React.useMemo(() => {
  //   if (data) {
  //     setDataLength(data.length);
  //     return countTodosForMaintenances(data);

  //   }
  //   return [];
  // }, [data]);


  // React.useEffect(() => {
  //   if (enhancedMaintenances?.length !== 0) {
  //     setActiveMaintenance(enhancedMaintenances[0]);
  //   }
  // }, [enhancedMaintenances]);

  const selectMaintenance = React.useCallback((index: number) => {
    requestAnimationFrame(() => {

      if (carouselRef && carouselRef.current) {
        carouselRef.current.scrollTo({ index, animated: false });
      }
    })
  }, [carouselRef]);

  const navigateToProtocolListScreen = React.useCallback(() => {
    if (!isLoading && !isNavigating) {
      setIsNavigating(true)

      const checkedMaintenancesArray = Array.from(checkedMaintenances);
      const skippedMaintenancesArray = Array.from(skippedMaintenances);

      navigate(Screens.ProtocolList, {
        id: id,
        maintenances: maintenanceNamesOrTitles,
        maintenanceLoading: isLoading,
        checkedMaintenances: checkedMaintenancesArray,
        title,
        selectMaintenance: selectMaintenance,
        skippedMaintenances: skippedMaintenancesArray,
        protocols: protocol,
        object,
      });

      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  }, [navigate, checkedMaintenances, isNavigating]);

  const navigateToToDoListScreen = React.useCallback((id: string, internalID: string) => {
    if (!isLoading && activeMaintenance) {
      navigate(
        Screens.ToDosHome,
        {
          id,
          internalID,
          navigateFromProtocol: true,
          maintenance: id
        }
      )
    }
  }, [navigate, isLoading, activeMaintenance]);


  const _renderItem = ({ item, index }: any) => {
    return (
      <Stack fill padding={["horizontal:normal"]}>
        <AddProtocol
          maintenanceNumber={index + 1}
          maintenance={item}
          maintenanceLength={data?.length!}
          onBack={onPrev}
          onForward={onNext}
          checkedMaintenances={checkedMaintenances}
          onSubmit={onPushProtocol}
          onTodoTap={navigateToToDoListScreen}
          activeMaintenance={activeMaintenance}
          onHeightChange={height => setCurrentHeight(height + 500)}
        />
      </Stack>
    )
  };

  return (
    <Screen withSafeArea scrollable>

      <Stack>
        <Spacer size="x-small" />

        <PageHeader
          rightButton={
            <Stack horizontal>
              <Tappable onTap={navigateToProtocolListScreen}>
                <ListIcon />
              </Tappable>
            </Stack>
          }
          accentColor={COLOR_X.PRIMARY}
          // onTapLeftButton={() => navigateToMaintenanceList(id)}
          showBackButton
          backButtonColor={COLOR_X.ACCENT}
          hideGlobalSearch={true}

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
        <Spacer size="small" />
      </Stack>

      <Stack style={{ flex: 1 }}>
        <Carousel
          ref={carouselRef}
          pagingEnabled={isPagingEnabled}
          data={data!}
          renderItem={_renderItem}
          scrollAnimationDuration={1000}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
          height={currentHeight}
          windowSize={2}
          onSnapToItem={(index: number) => {
            setMaintenanceIndex(index);
          }}
          {...baseOptions}
        />
      </Stack>
    </Screen>
  );
}

ProtocolScreenComponent.whyDidYouRender = true;

export const ProtocolScreen = React.memo(ProtocolScreenComponent);
