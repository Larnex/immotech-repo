import { listStyles as styles } from "@immotech-component/horizontal-lists-styles";
import { Header } from "@immotech-component/search-header";
import { SwipeList } from "@immotech-component/swipe-list";
import GridList from "@immotech-component/swipe-list/src/grid-list";
import { Text } from "@immotech-component/text";
import { PropertyListResponse } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { useNetInfo } from "@react-native-community/netinfo";
import { Stack } from "native-x-stack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated, Image,
  TouchableOpacity, TouchableWithoutFeedback
} from "react-native";
import PlaceholderImage from '../../../component/assets/default-building.4e26911c4ea17f38f4e8.jpg';
import FastImage from "react-native-fast-image";
// import { DataView, EmptyMessage } from "@immotech-component/data-view";


interface Props {
  properties: PropertyListResponse[];
  loading?: boolean;
  error?: Error | null;
  onSelect: (id: string, internalID: string, object?: string, lat?: string, lon?: string, parentId?: string, title?: string) => void;
  onAddPropertyTap?: (id?: string) => void;
  onDeleteProperty?: (id: string, internalPropertyID: string) => void;
  onEditPropertyTap?: (id: string) => void;
  onSearchIconTap?: () => void;
  onClearSearchTap?: () => void;
  searchActive?: boolean;
  filterHeaderActive?: boolean;
  onRefresh?: () => void;
  refreshing: boolean;
  parentId?: string;
  onSortIconTap?: () => void;
  byName?: boolean;
  byNumber?: boolean;
  byZip?: boolean;
  byCity?: boolean;
}

function PropertiesListViewComponent({
  properties,
  loading,
  error,
  onSelect,
  onAddPropertyTap,
  onDeleteProperty,
  onEditPropertyTap,
  onSearchIconTap,
  onClearSearchTap,
  searchActive,
  filterHeaderActive,
  onRefresh,
  refreshing,
  parentId,
  onSortIconTap,
  byName,
  byNumber,
  byZip,
  byCity,
}: Props) {

  const { t } = useTranslation();

  const [view, setView] = React.useState<"list" | "grid">("list");


  const createListData = (properties: PropertyListResponse[]) => {
    return properties?.map((item, index) => {
      return {
        key: `${index}`,
        title: item.title,
        nid: item.nid,
        id: item.id,
        city: item.city,
        zip_code: item.zip_code,
        image: item.image,
        lat: item.lat,
        lon: item.lon,
        unitsAmount: item.unitsAmount,
        maintenancesAmount: item.maintenancesAmount,
        todosAmount: item.todosAmount,
        parent_id: item.parent_id,
        type: item.type,
        street: item.street
      };
    });
  };

  const [listData, setListData] = React.useState(createListData(properties));

  const [listItemHeight, setListItemHeight] = React.useState<number>(0);
  const [isListItemHeightSet, setIsListItemHeightSet] = React.useState<boolean>(false);

  useEffect(() => {
    setListData(createListData(properties));
  }, [properties]);



  const sortedListData = React.useMemo(() => {
    let sortedArray = [...listData];
    if (byName) {
      sortedArray = listData.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    }
    if (byNumber) {
      sortedArray = listData.sort((a, b) => {
        if (a.id! < b.id!) {
          return -1;
        }
        if (a.id! > b.id!) {
          return 1;
        }
        return 0;
      });
    }
    if (byZip) {
      sortedArray = listData.sort((a, b) => {
        if (a.zip_code! < b.zip_code!) {
          return -1;
        }
        if (a.zip_code! > b.zip_code!) {
          return 1;
        }
        return 0;
      });
    }
    if (byCity) {
      sortedArray = listData.sort((a, b) => {
        if (a.city! < b.city!) {
          return -1;
        }
        if (a.city! > b.city!) {
          return 1;
        }
        return 0;
      });
    }
    return sortedArray;
  }, [byName, byNumber, byZip, byCity, listData, properties]);



  const renderHeader = React.useCallback(
    () => (
      <Header
        searchActive={searchActive}
        onSearch={onSearchIconTap}
        onClearSearchTap={onClearSearchTap}
        filterHeaderActive={filterHeaderActive}
        color={COLOR_X.SECONDARY}
        onSort={onSortIconTap}
        onViewChange={onViewChange}
      />
    ),
    [searchActive, onClearSearchTap, onSearchIconTap]
  );

  const onViewChange = React.useCallback((view: "list" | "grid") => {
    setView(view);
  }, []);

  const closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };



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
            onPress={() => onSelect && onSelect(itemId, data.id, 'property', data.lat, data.lon, data.parent_id, data.title)}
            activeOpacity={0.8}
          >
            <Stack style={styles.itemContainer}>
              <FastImage source={data.image ? { uri: data.image, priority: FastImage.priority.normal } : PlaceholderImage} style={styles.itemImage} resizeMode={FastImage.resizeMode.contain} />
              <Stack style={styles.overlayContainer}>
                {!!data.unitsAmount && (
                  <Text style={styles.overlayText}>
                    {data.unitsAmount}{" "}
                    {data.unitsAmount === 1 ? t("main.utilization_unit") : t("main.utilization_units")}
                  </Text>
                )}
                {!!data.maintenancesAmount && (
                  <Text style={styles.overlayText}>
                    {data.maintenancesAmount} {t("main.maintenance")}
                  </Text>
                )}
                {!!data.todosAmount && (
                  <Text style={styles.overlayText}>
                    {data.todosAmount}{" "}
                    {data.todosAmount === 1 ? "ToDo" : "ToDo's"}
                  </Text>
                )}
              </Stack>

              <Stack style={styles.itemDetails}>
                <Text style={styles.itemTitle} textColor={COLOR_X.OMNY_BLUE} numberOfLines={1}>{data.title}</Text>
                <Text style={styles.itemSubtitle}>{data.type}</Text>
                <Text style={styles.itemSubtitle}>ID: {data.id}</Text>


                <Stack style={styles.itemLocation}>
                  <Text style={styles.itemLocationText}>{data.city}, {data.street}, {data.zip_code}</Text>
                </Stack>

              </Stack>
            </Stack>
          </TouchableOpacity>
        </Stack>
      </TouchableWithoutFeedback>
    )
  };

  const renderItem = ({ item }: { item: any }, rowMap: any) => {

    return (
      <VisibleItem
        data={item}

        itemId={item.nid}
      />
    );
  };




  return (
    <Stack fill>


      {renderHeader()}


      {view === 'list' ? <SwipeList data={sortedListData} renderItem={renderItem} onEdit={onEditPropertyTap} onDelete={onDeleteProperty} refreshing={refreshing} onRefresh={onRefresh} itemHeight={listItemHeight} /> : (
        <GridList data={properties} properties onSelectProperty={onSelect} />
      )}


    </Stack>
  );
}

export const PropertiesListView = React.memo(PropertiesListViewComponent);
