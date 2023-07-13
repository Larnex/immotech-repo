import { DataView } from "@immotech-component/data-view";
import { Icon } from "@immotech-component/icon-component";
import { Text } from "@immotech-component/text";
import { MaintenanceFormType, MaintenanceResponse } from "@immotech-feature/maintenance-api";
import { MaintenanceOpenImageView } from "@immotech-feature/maintenance-open-image";
import { COLOR_X } from "@immotech-feature/theme";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Image, Dimensions } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { CaretBackIcon, CaretForwardIcon } from "native-x-icon";


interface Props {
  maintenance?: MaintenanceResponse | MaintenanceFormType;
  loading?: boolean;
  type?: string;
  error?: Error | null;
  parentTitle?: string;
  onToDoListTap?: (id?: string, title?: string, maintenance?: boolean) => void;
}

const styles = StyleSheet.create({
  infoText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
});

const PAGE_WIDTH = Dimensions.get("window").width

export function MaintenanceDetailsView({
  maintenance,
  loading,
  type,
  error,
  parentTitle,
  onToDoListTap,
}: Props) {
  const [isVertical, setIsVertical] = React.useState(false);




  const netInfo = useNetInfo();
  const { t } = useTranslation();


  const [showImage, setShowImage] = useState(false);

  const imgUrls = useCallback((maintenance) => {
    if (typeof maintenance?.field_buildingservice_pictures === "object" && !Array.isArray(maintenance?.field_buildingservice_pictures)) {
      return maintenance?.field_buildingservice_pictures!.und!.map((item: any) => {
        return { url: `https://immotech.cloud/system/files/${item.uri.replace("private://", "")}` };
      });
    } else if (Array.isArray(maintenance?.field_buildingservice_pictures) && !!maintenance?.field_buildingservice_pictures.length) {
      return maintenance?.field_buildingservice_pictures.map((item: any) => {
        return { url: `data:image/png;base64,${item}` };
      });
    } else {
      return maintenance?.field_buildingservice_pictures;
    }
  }, [maintenance]);

  const Arrow = ({ onPress, iconName }: { onPress: () => void; iconName: string }) => (
    <Tappable onTap={onPress} style={{ padding: 10 }}>
      {iconName === "arrow-back" && <CaretBackIcon color={COLOR_X.BLACK} />}
      {iconName === "arrow-forward" && <CaretForwardIcon color={COLOR_X.BLACK} />}
    </Tappable>
  );

  const baseOptions = isVertical
    ? ({
      vertical: true,
      width: PAGE_WIDTH,
      height: PAGE_WIDTH / 2,
    } as const)
    : ({
      vertical: false,
      width: PAGE_WIDTH,
      height: PAGE_WIDTH / 2,
    } as const);

  const CarouselArrows = ({
    carouselRef,
  }: {
    carouselRef: React.RefObject<ICarouselInstance>;
  }) => {
    const _onPrevPress = () => {
      carouselRef.current?.prev();
    };

    const _onNextPress = () => {
      carouselRef.current?.next();
    };

    return (
      <Stack
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          position: "absolute",
          top: "25%",
        }}
      >
        <Arrow onPress={_onPrevPress} iconName="arrow-back" />
        <Arrow onPress={_onNextPress} iconName="arrow-forward" />
      </Stack>
    );
  };

  const InfoText = ({ label, value }: { label: string; value: string }) => (
    <Stack alignLeft>
      <Text style={styles.infoLabel} textColor={COLOR_X.ACCENT2} fontSize="small">
        {label}:
      </Text>
      <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{value}</Text>
    </Stack>
  );

  const Note = ({ note, index }: { note: any; index: number }) => (
    <Stack style={{ width: '100%', alignItems: 'center' }}>
      <Text alignCenter fontSize={16} textColor={COLOR_X.ACCENT3} bold>
        {t("todo.details.note")} #{index + 1}
      </Text>
      <Spacer size="x-small" />
      <Stack alignCenter>
        <Text style={styles.infoLabel} textColor={COLOR_X.ACCENT2} fontSize="small">
          Name:
        </Text>
        <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{note.title}</Text>
        <Spacer size="xx-small" />
        <Text style={styles.infoLabel} textColor={COLOR_X.ACCENT2} fontSize="small">
          {t("todo.details.description")}:
        </Text>
        <Text textColor={COLOR_X.ACCENT3} fontSize="normal">{note.text}</Text>
      </Stack>
    </Stack>
  );

  const NoteCarousel = ({ notes }: { notes: any[] }) => {
    const carouselRef = React.useRef<ICarouselInstance>(null);


    const _renderItem = ({ item, index }: { item: any; index: number }) => (
      <Note note={item} index={index} />
    );

    return (
      <Stack alignCenter alignMiddle>
        <Carousel
          {...baseOptions}
          ref={carouselRef}
          data={notes}
          renderItem={_renderItem}
          style={{ width: "100%" }}
        // sliderWidth={Dimensions.get('window').width}
        // itemWidth={Dimensions.get('window').width * 0.9}
        // activeSlideAlignment="center"
        />
        <CarouselArrows carouselRef={carouselRef} />
      </Stack>
    );
  };

  return (
    <DataView data={maintenance} isLoading={loading}>
      <Stack padding={["horizontal:normal", "vertical:small"]} >

        <Stack fillHorizontal horizontal justifyBetween>
          <Stack alignLeft>
            <InfoText
              label={t("todo.details.object_usage_unit")}
              value={parentTitle!}
            />
            <Spacer size="x-small" />
            <InfoText label={t("tga.type")} value={type!} />
            <Spacer size="x-small" />


            {!Array.isArray(maintenance?.field_buildingservice_manufactur)
              ? <InfoText label={t("tga.manufacturer")} value={maintenance?.field_buildingservice_manufactur?.und?.[0]
                ?.value!} />
              : <InfoText label={t("tga.manufacturer")} value={t("tga.no_manufacturer")} />}

            <Spacer size="x-small" />

            {!Array.isArray(maintenance?.field_buildingservice_build_date)
              ? <InfoText label={t("tga.date_installation")} value={maintenance?.field_buildingservice_build_date?.und?.[0]?.value?.date ?? maintenance?.field_buildingservice_build_date?.und?.[0]
                ?.value!} />
              : <InfoText label={t("tga.date_installation")} value={"Year/Date of Installation is not set"} />}

          </Stack>

          {!Array.isArray(maintenance?.field_buildingservice_pictures) && (
            <Stack
              alignRight
              fill
            >
              <Tappable onTap={() => setShowImage(true)}>
                <Image
                  source={{
                    uri: (netInfo.isConnected && typeof maintenance?.field_buildingservice_pictures !== 'string') ? `https://immotech.cloud/system/files/${maintenance?.field_buildingservice_pictures?.und?.[0]?.filename
                      }` : `data:image/png;base64,${maintenance?.field_buildingservice_pictures}`
                  }}
                  style={{ width: 125, height: 125, borderRadius: 10 }}
                />
              </Tappable>
            </Stack>
          )}


          <MaintenanceOpenImageView
            show={showImage}
            onDismiss={() => setShowImage(false)}
            imgUrls={imgUrls(maintenance)}
          />
        </Stack>

        <Spacer size="x-small" />


        {!Array.isArray(maintenance?.field_buildingservice_notes) ? (
          <NoteCarousel notes={maintenance?.field_buildingservice_notes!.und!} />
        ) : (
          <Text>No Notes</Text>
        )}

      </Stack>
    </DataView>
  );
}
