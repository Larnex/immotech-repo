import { DataView, EmptyMessage } from "@immotech-component/data-view";
import { MapSnapshot } from "@immotech-component/map-snapshot";
import { Header } from "@immotech-component/search-header";
import { SwipeList } from "@immotech-component/swipe-list";
import GridList from "@immotech-component/swipe-list/src/grid-list";
import { Text } from "@immotech-component/text";
import { Entity } from "@immotech-feature/entity-api";
import { COLOR_X } from "@immotech-feature/theme";
import { Stack } from "native-x-stack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  StyleSheet,
  TouchableOpacity, TouchableWithoutFeedback, Image
} from "react-native";
import PlaceholderImage from "../../../component/assets/default-building.4e26911c4ea17f38f4e8.jpg";
interface Props {
  entities: Entity[];
  loading?: boolean;
  error?: Error | null;
  onSelect?: (id: string, internalID: string, title?: string) => void;
  onAddEntityTap?: (id?: string) => void;
  onDeleteEntityTap?: (id: string, internalID: string) => void;
  onEditEntityTap?: (id: string) => void;
  onRefresh?: () => void;
  refreshing: boolean;

  searchActive?: boolean;
  onClearSearchTap?: () => void;
  onSearchIconTap?: () => void;
  onSortIconTap?: () => void;

  byName?: boolean;
  byNumber?: boolean;
  byZip?: boolean;
  byCity?: boolean;
}

export function EntitiesListView({
  entities,
  loading,
  error,
  onSelect,
  onAddEntityTap,
  onEditEntityTap,
  onDeleteEntityTap,
  onRefresh,
  refreshing,
  searchActive,
  onClearSearchTap,
  onSearchIconTap,
  onSortIconTap,

  byName,
  byNumber,
  byZip,
  byCity,
}: Props) {
  const { t } = useTranslation();



  const [listData, setListData] = React.useState(
    entities?.map((item, index) => {
      return {
        key: `${index}`,
        title: item?.title,
        nid: item?.nid ?? item?.id,
        zip_code: item?.zip_code,
        city: item?.city,
        id: item?.id,
        created: item?.created,
        changed: item?.changed,
        propertiesAmount: item?.propertiesAmount,
        image: item?.image
      };
    })
  );

  const [view, setView] = React.useState<"list" | "grid">("list");

  const [listItemHeight, setListItemHeight] = React.useState<number>(0);
  const [isListItemHeightSet, setIsListItemHeightSet] = React.useState<boolean>(false);


  const onViewChange = React.useCallback((view: "list" | "grid") => {
    setView(view);
  }, [])


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
  }, [byName, byNumber, byZip, byCity, entities, listData]);


  // Search Header
  const renderHeader = React.useCallback(
    () => (
      <Header
        searchActive={searchActive}
        filterHeaderActive={true}
        onSearch={onSearchIconTap}
        onSort={onSortIconTap}
        onClearSearchTap={onClearSearchTap}
        onViewChange={onViewChange}
      ></Header>
    ),
    [searchActive, onClearSearchTap, onSearchIconTap]
  );

  useEffect(() => {
    setListData(
      entities?.map((item, index) => {
        return {
          key: `${index}`,
          title: item?.title,
          nid: item?.nid || '',
          zip_code: item?.zip_code,
          city: item?.city,
          id: item?.id,
          created: item?.created,
          changed: item?.changed,
          propertiesAmount: item?.propertiesAmount,
          image: item?.image
        };
      }) || []
    );
  }, [entities]);

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
        useNativeDriver: true,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <TouchableWithoutFeedback>
        <Stack style={styles.cardContainer}>
          <TouchableOpacity
            onPress={() => onSelect && onSelect(itemId, data.id, data.title)}
            activeOpacity={0.8}
            onLayout={(e) => {
              if (!isListItemHeightSet) {
                const { height } = e.nativeEvent.layout;
                setListItemHeight(height);
                setIsListItemHeightSet(true);
              }
            }}
          >
            <Stack style={styles.itemContainer}>
              {/* <MapSnapshot city={data.city} style={styles.itemImage} /> */}

              <Image source={data.image ? { uri: data.image } : PlaceholderImage} style={styles.itemImage} />


              <Stack style={styles.itemDetails}>
                <Text style={styles.itemTitle} textColor={COLOR_X.OMNY_BLUE} numberOfLines={1}>{data.title} (ID: {data.id})</Text>
                <Text style={styles.itemLocationText}>{data.city}, {data.zip_code}</Text>
                {!!data.propertiesAmount && (
                  <Text style={styles.itemProperties}>
                    {data.propertiesAmount}{" "}
                    {data.propertiesAmount === 1 ? "property" : "properties"}</Text>
                )}
              </Stack>
            </Stack>
          </TouchableOpacity>
        </Stack>
      </TouchableWithoutFeedback>
    )
  }


  const renderItem = ({ item }: { item: Entity }, rowMap: any) => {
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

      <DataView
        fill
        isLoading={loading}
        // error={error}
        data={listData}
        emptyMessage={<EmptyMessage title={`${t("main.no_entities")}`}>{t("main.no_entities")}</EmptyMessage>}
      >
        {view === 'list' ?
          <SwipeList data={sortedListData} renderItem={renderItem} onEdit={onEditEntityTap} onDelete={onDeleteEntityTap} refreshing={refreshing} onRefresh={onRefresh} itemHeight={listItemHeight} /> : (
            <GridList data={entities} entities onSelectEntity={onSelect} />
          )}
      </DataView>
    </Stack>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 4,
    borderWidth: 0,
    elevation: 0,
    // backgroundColor: '#123'
  },
  itemContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // padding: 10,
  },
  itemProperties: {
    color: '#888',
    fontSize: 14,
    marginRight: 10
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  itemImage: {
    width: 155,
    height: 155,
  },
  imageText: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.68)',
    borderRadius: 4,
    color: 'white',
    padding: 4,
    fontSize: 12,
    marginTop: 10,
    marginLeft: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    marginTop: 12,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  itemLocation: {
    flexDirection: 'row',
  },
  itemLocationText: {
    color: '#888',
    fontSize: 14,
    marginRight: 10,
  },

});

// const EntitiesListView = React.memo(EntitiesListViewComponent);

// export default EntitiesListView;
