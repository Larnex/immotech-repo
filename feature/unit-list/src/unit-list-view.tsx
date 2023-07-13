import { SwipeList } from "@immotech-component/swipe-list";
import { Text } from "@immotech-component/text";
import { UnitResponse } from "@immotech-feature/unit-api";
import { Stack } from "native-x-stack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback
} from "react-native";
import { COLOR_X } from "../../theme/src/theme";


interface Props {
  units: UnitResponse[];
  loading?: boolean;
  error?: Error | null;
  onSelect?: (id: string, internalID?: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
  onAddUnitTap?: (id?: string) => void;
  onDeleteUnit?: (id: string, internalID: string, parentId?: string) => void;
  onEditUnitTap?: (id: string) => void;
  onAddDamageTap?: () => void;
  onAddMaintenanceTap?: () => void;
  onRefresh?: () => void;
  entityId?: string;
  refreshing: boolean;
}

export default function UnitListViewComponent({
  units,
  loading,
  error,
  onSelect,
  onAddUnitTap,
  onDeleteUnit,
  onEditUnitTap,
  onAddDamageTap,
  onAddMaintenanceTap,
  onRefresh,
  refreshing,
}: Props) {
  const { t } = useTranslation();
  const [listItemHeight, setListItemHeight] = React.useState<number>(0);
  const [isListItemHeightSet, setIsListItemHeightSet] = React.useState<boolean>(false);

  const [listData, setListData] = React.useState(
    units?.map((item, index) => {
      return {
        key: `${index}`,
        title: item.title,
        nid: item.nid,
        id: item.id,
        city: item.city,
        street: item.street,
        zip_code: item.zip_code,
        type: item.type,
        maintenancesAmount: item.maintenancesAmount,
        todosAmount: item.todosAmount,
        lat: item.lat,
        lon: item.lon,
        parentId: item.parent_id,
        parentName: item.parentName
      };
    })
  );

  useEffect(() => {
    setListData(
      units?.map((item, index) => {
        return {
          key: `${index}`,
          title: item.title,
          nid: item.nid,
          id: item.id,
          city: item.city,
          street: item.street,
          zip_code: item.zip_code,
          type: item.type,
          maintenancesAmount: item.maintenancesAmount,
          todosAmount: item.todosAmount,
          lat: item.lat,
          lon: item.lon,
          parentId: item.parent_id,
          parentName: item.parentName
        };
      })
    );
  }, [units]);

  const VisibleItem = (props: any) => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      rightActionState,
      itemId,
    } = props;
    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <TouchableWithoutFeedback onLayout={(e) => {
        if (!isListItemHeightSet) {
          const { height } = e.nativeEvent.layout;
          setListItemHeight(height);
          setIsListItemHeightSet(true);
        }
      }}>
        <Stack style={styles.cardContainer}>
          <TouchableOpacity
            onPress={() => onSelect && onSelect(itemId, data.id, 'unit', data.lat, data.lon, data.parentId, data.title)}
            activeOpacity={0.8}
          >
            <Stack style={styles.itemContainer}>
              {/* <MapSnapshot lat={data.lat} lon={data.lon} style={styles.itemImage} /> */}

              <Stack style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {data.title} (ID: {data.id ?? data.nid})
                </Text>

                <Text style={styles.itemParentInfo} textColor={COLOR_X.SECONDARY}>
                  {t("main.parent_container")}: {data.parentName}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {t("properties_details.type")}: {data.type}
                </Text>
                <Stack style={styles.itemLocation}>
                  <Text style={styles.itemLocationText}>{data.city},</Text>
                  <Text style={styles.itemLocationText}>{data.street},</Text>
                  <Text style={styles.itemLocationText}>{data.zip_code}</Text>
                </Stack>
                {!!data.maintenancesAmount && (
                  <Stack style={styles.itemChildrenContainer}>
                    <Text style={styles.itemChildren}>
                      {data.maintenancesAmount} {t("main.maintenance")}
                    </Text>
                  </Stack>
                )}
                {!!data.todosAmount && (
                  <Stack style={styles.itemChildrenContainer}>

                    <Text style={styles.itemChildren}>
                      {data.todosAmount}{" "}
                      {data.todosAmount === 1 ? "ToDo" : "ToDo's"}
                    </Text>
                  </Stack>

                )}
              </Stack>

            </Stack>
          </TouchableOpacity>
        </Stack>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = ({ item }: { item: any }, rowMap: any) => {
    const rowHeightAnimatedValue = new Animated.Value(150);

    return (
      <VisibleItem
        data={item}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        itemId={item.nid}
      />
    );
  };

  return (
    <Stack fill>
      <SwipeList data={listData} renderItem={renderItem} refreshing={refreshing} onRefresh={onRefresh} onEdit={onEditUnitTap} onDelete={onDeleteUnit} itemHeight={listItemHeight} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 155,
    height: 155,
    borderRadius: 6,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemParentInfo: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "bold",
  },
  separator: {
    borderWidth: 0.5,
    backgroundColor: "#aaa",
    marginVertical: 8
  },
  itemProperties: {
    fontSize: 12,
    color: '#888',
  },
  itemLocation: {
    flexDirection: 'row',
    marginTop: 2,
  },
  itemLocationText: {
    color: '#888',
    fontSize: 12,
    marginRight: 10,
  },
  itemChildrenContainer: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  itemChildren: {
    color: '#444',
    fontSize: 14,
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    position: 'absolute',
    left: 5,
  },
});

export const UnitListView = React.memo(UnitListViewComponent);





