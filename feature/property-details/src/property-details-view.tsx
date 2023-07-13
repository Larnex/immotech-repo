import { DataView } from "@immotech-component/data-view";
import { Text } from "@immotech-component/text";
import { PropertyDataType } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { useNetInfo } from "@react-native-community/netinfo";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { PropertyOpenImageView } from "./property-open-image-view";

interface Props {
  property?: PropertyDataType;
  loading?: boolean;
  error?: Error | null;
  propertyId?: string;
  types?: any;
  attributesList?: any;
  onOpenMap: (lon: string, lat: string) => void;
  onToDoListTap?: (internalID: string, id?: string, title?: string) => void;
  onMaintenanceListTap?: (internalID: string, id?: string, title?: string) => void;
  showFullInfo?: boolean;
}

export function PropertyDetailsView({
  property,
  loading,
  error,
  types,
  attributesList,
  onOpenMap,
  onToDoListTap,
  onMaintenanceListTap,
  showFullInfo
}: Props) {
  const {
    title,
    field_property_address,
    field_property_geofield,
    field_property_type,
    field_build_attributes,
    field_property_id
  } = property!;


  const attributes = property?.field_build_attributes!.und ?? [];
  const netInfo = useNetInfo();
  const { t } = useTranslation();

  const type = types?.[property?.field_property_type?.und?.[0]?.tid] ?? `No type`;

  const [showImage, setShowImage] = useState(false);

  return (
    <Stack>
      {!showFullInfo ? (
        <DataView data={property} isLoading={loading}>

          <Stack
            fillHorizontal
            horizontal
            padding={["horizontal:normal", "vertical:small"]}
          >
            <Stack fill maxWidth={"50%" as any} alignLeft>
              <Stack alignLeft>
                <Text textColor={COLOR_X.ACCENT2} fontSize="small">
                  ID
                </Text>
                <Text textColor={COLOR_X.ACCENT3} fontSize="normal">
                  {field_property_id?.und?.[0]?.value}
                </Text>
              </Stack>
              <Spacer size="x-small" />
              <Stack alignLeft>
                <Text textColor={COLOR_X.ACCENT2} fontSize="small">
                  {t("entities_list.zip_code")}
                </Text>
                <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignCenter>
                  {property?.field_property_address?.und?.[0]?.postal_code ?? `No postal code`}
                </Text>
              </Stack>
              <Spacer size="x-small" />
              <Stack alignLeft>
                <Text textColor={COLOR_X.ACCENT2} fontSize="small">
                  {t("entities_list.city")}
                </Text>
                <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignRight>
                  {property?.field_property_address?.und?.[0]?.locality ?? `No locality`}
                </Text>
              </Stack>
            </Stack>
            {!!property?.field_property_overview_picture && (
              <Stack
                fill
                alignRight
                maxWidth={"50%" as any}
              >
                {!Array.isArray(property?.field_property_overview_picture) && (
                  <Tappable onTap={() => setShowImage(true)}>
                    <Image
                      source={{
                        uri: (netInfo.isConnected && typeof property?.field_property_overview_picture !== 'string') ? `https://immotech.cloud/system/files/${property?.field_property_overview_picture?.und?.[0]?.filename
                          }` : `data:image/png;base64,${property?.field_property_overview_picture}`
                      }}
                      style={{ width: 140, height: 140, borderRadius: 10 }}
                    />
                  </Tappable>
                )}
              </Stack>
            )}

            <PropertyOpenImageView
              show={showImage}
              onDismiss={() => setShowImage(false)}
              property={property}
              propertyOnline={netInfo.isConnected && typeof property?.field_property_overview_picture !== 'string'}
            ></PropertyOpenImageView>
          </Stack>
        </DataView>

      ) : (
        <ScrollView style={styles.container}>

          {!!property?.field_property_overview_picture && (
            <Stack
            >
              {!Array.isArray(property?.field_property_overview_picture) && (
                <Tappable onTap={() => setShowImage(true)}>
                  <Image
                    source={{
                      uri: (netInfo.isConnected && typeof property?.field_property_overview_picture !== 'string') ? `https://immotech.cloud/system/files/${property?.field_property_overview_picture?.und?.[0]?.filename
                        }` : `data:image/png;base64,${property?.field_property_overview_picture}`
                    }}
                    resizeMode="cover"
                    style={{ minWidth: "100%", minHeight: 125 }}
                  />
                </Tappable>
              )}
            </Stack>

          )}

          <Spacer size="normal" />

          <Stack >
            <Text style={styles.title}>{title ?? `No title`}</Text>
            <Text>{t("properties_details.type")}: {type}</Text>
          </Stack>

          <Spacer size="small" />

          <View style={styles.sectionTitle}>
            <Text bold fontSize={18}>{t("properties_details.address")}</Text>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.addressContainerItem}>
              <Text style={styles.addressLine}>{t("profile.street")}</Text>
              <Text style={styles.addressLine}>{field_property_address?.und?.[0]?.thoroughfare ?? `No street`}</Text>
            </View>
            <View style={styles.addressContainerItem}>
              <Text style={styles.addressLine}>{t("profile.city")}</Text>
              <Text style={styles.addressLine}>
                {field_property_address?.und?.[0]?.locality ?? `No locality`}
              </Text>
            </View>
            <View style={styles.addressContainerItem}>
              <Text style={styles.addressLine}>{t("entities_list.zip_code")}</Text>
              <Text style={styles.addressLine}>
                {field_property_address?.und?.[0]?.postal_code ?? `No postal code`}
              </Text>
            </View>
          </View>

          <Spacer size="small" />

          {attributes.length !== 0 && (
            <>
              <View style={styles.sectionTitle}>

                <Text bold fontSize={18}>Attribute</Text>
              </View>



              <View style={styles.addressContainer}>
                <FlatList
                  data={attributes}
                  renderItem={({ item }) => {
                    return (

                      <View style={styles.addressContainerItem}>
                        <Text style={styles.addressLine}>{attributesList[item.attribute!] ?? ""}</Text>
                        <Text style={styles.addressLine}>{item.value ?? ""}</Text>
                      </View>
                    )
                  }}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            </>
          )}

          <Spacer size="large" />
          <Spacer />



          <PropertyOpenImageView
            show={showImage}
            onDismiss={() => setShowImage(false)}
            property={property}
            propertyOnline={netInfo.isConnected && typeof property?.field_property_overview_picture !== 'string'}
          />
        </ScrollView>
      )
      }
    </Stack>

  )
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#F8F8F8"
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#333"
  },
  image: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: "#F5F6F8",
    borderRadius: 10,
    padding: 10
  },
  addressContainerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ABB3C4",
  },
  addressTitleContainer: {
    flexDirection: "row",
    marginBottom: 10
  },
  addressIcon: {
    fontSize: 30,
    marginRight: 10,
    color: "#007AFF",
  },
  addressLine: {
    fontSize: 14,
  },
  map: {
    height: 200,
    width: '100%',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#333"
  },
  attribute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: "#F5F6F8",
    borderRadius: 5,
    padding: 10,
    justifyContent: "space-between"
  },
  attributeIcon: {
    fontSize: 20,
    marginRight: 20,
    color: "#007AFF",
  },
  attributeText: {
    fontSize: 16,
    color: "#333"
  },
  propertyImage: {
    height: 150,
    width: 200,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 10,
  },
  table: {
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  tableRow: {
    flexDirection: 'row',
  },

  tableRowTitle: {
    backgroundColor: "#F5F6F8",
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    padding: 10,
  },
});
