import { Button } from "@immotech-component/button";
import { SwipeList } from "@immotech-component/swipe-list";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoListResponse } from "@immotech-feature/todo-api";
import {
  FilterIcon, SearchIcon,
  SwapVerticalIcon
} from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  StyleSheet, TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

interface Props {
  todos: ToDoListResponse[] | [];
  filterHeaderActive?: boolean;
  parentId?: string;
  loading?: boolean;
  searchActive?: boolean;
  error?: Error | null;
  onSelect?: (id: string, title?: string) => void;
  onDeleteToDoTap?: (id: string, internalID: string, parentId?: string) => void;
  onEditToDoTap?: (id: string) => void;
  onSearchIconTap?: () => void;
  onClearSearchTap?: () => void;
  onFilterIconTap?: () => void;
  onRefresh?: () => void;
  refreshing: boolean;
  onAddToDoTap?: () => void;
  onSortIconTap?: () => void;
  byToDoName?: boolean;
  byCostHigh?: boolean;
  byCostLow?: boolean;
  byUrgency?: boolean;
  byStatus?: boolean;
}

export function ToDoListViewComponent({
  filterHeaderActive,
  todos,
  loading,
  searchActive,
  error,
  onSelect,
  onDeleteToDoTap,
  onEditToDoTap,
  onSearchIconTap,
  onClearSearchTap,
  onFilterIconTap,
  onRefresh,
  refreshing,
  onAddToDoTap,
  onSortIconTap,
  byToDoName,
  byCostHigh,
  byCostLow,
  byUrgency,
  byStatus,
}: Props) {
  const { t } = useTranslation();

  const statusColors: {
    [key: string]: {
      backgroundColor: string;
      fontColor: string;
    }
  } = {
    in_progress: {
      backgroundColor: 'rgba(255, 255, 0, 0.1)', // Mat yellow
      fontColor: '#000',
    },
    done: {
      backgroundColor: 'rgba(0, 255, 0, 0.1)', // Mat green
      fontColor: '#000',
    },
    open: {
      backgroundColor: 'rgba(255, 0, 0, 0.1)', // Mat red
      fontColor: '#000',
    },
  };

  const [listData, setListData] = React.useState<ToDoListResponse[]>(
    (todos ?? []).map((todo, index) => ({
      key: index,
      title: todo.title,
      nid: todo.nid,
      assigned_entity_type: todo.assigned_entity_type,
      assigned_entity_title: todo.assigned_entity_title,
      assigned_entity_id: todo.assigned_entity_id,
      priority: todo.priority,
      status: todo.status,
      short_description: todo.short_description,
      cost: todo.cost,
      created: todo.created,
      image: todo.image
    }))
  );

  useEffect(() => {
    setListData(
      (todos ?? []).map((todo, index) => ({
        key: index,
        title: todo.title,
        nid: todo.nid,
        assigned_entity_type: todo.assigned_entity_type,
        assigned_entity_id: todo.assigned_entity_id,
        assigned_entity_title: todo.assigned_entity_title,
        priority: todo.priority,
        status: todo.status,
        short_description: todo.short_description,
        cost: todo.cost,
        created: todo.created,
        image: todo.image,
      }))
    );
  }, [todos]);

  const [listItemHeight, setListItemHeight] = React.useState<number>(0);
  const [isListItemHeightSet, setIsListItemHeightSet] = React.useState<boolean>(false);

  const sortedListData = React.useMemo(() => {
    let sortedArray = [...listData];

    if (byToDoName) {
      sortedArray = listData.sort((a, b) => {
        if (a.title! < b.title!) {
          return -1;
        }
        if (a.title! > b.title!) {
          return 1;
        }
        return 0;
      });
    }

    if (byCostHigh) {
      sortedArray = listData.sort((a, b) => {
        if (+a.cost > +b.cost) {
          return -1;
        }
        if (+a.cost < +b.cost) {
          return 1;
        }
        return 0;
      });

    }
    if (byCostLow) {
      sortedArray = listData.sort((a, b) => {
        if (+a.cost < +b.cost) {
          return -1;
        }
        if (+a.cost > +b.cost) {
          return 1;
        }
        return 0;
      });
    }
    if (byStatus) {
      sortedArray = listData.sort((a, b) => {
        if (a.status! < b.status!) {
          return -1;
        }
        if (a.status! > b.status!) {
          return 1;
        }
        return 0;
      });
    }
    if (byUrgency) {
      sortedArray = listData.sort((a, b) => {
        if (a.priority! < b.priority!) {
          return -1;
        }
        if (a.priority! > b.priority!) {
          return 1;
        }
        return 0;
      });
    }

    return sortedArray;
  }, [byCostHigh, byCostLow, byToDoName, byUrgency, byStatus, listData, todos]);


  const renderHeader = React.useCallback(
    () => (
      <Header
        searchActive={searchActive}
        onSearch={onSearchIconTap}
        onFilter={onFilterIconTap}
        onClearSearchTap={onClearSearchTap}
        filterHeaderActive={filterHeaderActive}
        onSort={onSortIconTap}
      />
    ),
    [searchActive, onClearSearchTap, onFilterIconTap, onSearchIconTap]
  );


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
      }} >
        <Stack style={styles.cardContainer
        }>

          <TouchableOpacity
            onPress={() => onSelect && onSelect(itemId, data.assigned_entity_title)}
            activeOpacity={0.8}
          >
            <Stack
              style={styles.itemContainer}
            >

              <Stack style={styles.itemDetails}>
                <Stack style={{
                  backgroundColor:
                    statusColors[data.status]?.backgroundColor || styles.cardContainer.backgroundColor,
                }}>

                  <Text style={styles.itemTitle} >
                    {data?.title}
                  </Text>
                </Stack>



                <Stack style={styles.itemLocation}>
                  {!!data?.assigned_entity_type && (
                    <Text style={styles.itemLocationText}>
                      {t("main." + data?.assigned_entity_type)}:{" "}
                      {data?.assigned_entity_title}
                    </Text>
                  )}

                  <Text style={styles.itemLocationText}>
                    {`${t("main.created")}: ${new Date(
                      +data.created * 1000
                    ).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}`}
                  </Text>

                  <Text style={styles.itemLocationText}>
                    {data?.short_description
                      ? `${t("todo.list.short_desc")}: ${data?.short_description
                      }`
                      : `${t("todo.list.no_short_desc")}`}
                  </Text>

                  <Text style={styles.itemLocationText}>
                    Status:{" "}
                    {data?.status == "open"
                      ? `${t("todo.list.status.open")}`
                      : data?.status == "in_progress"
                        ? `${t("todo.list.status.in_progress")}`
                        : data?.status == "done"
                          ? `${t("todo.list.status.done")}`
                          : `${t("todo.list.status.undefined")}`}
                  </Text>

                  <Text style={styles.itemLocationText}>
                    {data.cost
                      ? `${t("todo.list.cost")}: ${data.cost}€`
                      : "No cost"}
                  </Text>

                  <Text style={styles.itemLocationText}>
                    {t("todo.list.urgency")}:{" "}
                    {data.priority == "middle"
                      ? `${t("todo.list.urgency_types.middle")}`
                      : data.priority == "short"
                        ? `${t("todo.list.urgency_types.short")}`
                        : data.priority == "long"
                          ? `${t("todo.list.urgency_types.long")}`
                          : `${t("todo.list.urgency_types.no_urgency")}`}
                  </Text>

                </Stack>
              </Stack>
              {data.image && (
                <Image source={{ uri: `https://immotech.cloud/system/files/${data.image}` }} style={styles.itemImage} />
              )}

            </Stack>

          </TouchableOpacity>

        </Stack>
      </TouchableWithoutFeedback>
    );
  };

  function Header({
    searchActive,
    onSearch,
    onFilter,
    onClearSearchTap,
    filterHeaderActive,
    onSort,
  }: {
    filterHeaderActive?: boolean;
    searchActive?: boolean;
    onClearSearchTap?: () => void;
    onSearch?: () => void;
    onFilter?: () => void;
    onSort?: () => void;
  }) {
    return filterHeaderActive ? (
      <Stack padding="small" fillHorizontal>
        <Stack alignMiddle horizontal fillHorizontal>
          <Spacer fill />
          {searchActive ? (
            <Button
              clear
              textColor={COLOR_X.TO_DO_HEADER}
              size="small"
              onTap={onClearSearchTap}
            >
              {t("main.clear_search")}
            </Button>
          ) : null}
          <Tappable onTap={onSearch}>
            <SearchIcon color={COLOR_X.TO_DO_HEADER} />
          </Tappable>
          <Spacer size="normal" />

          <>
            <Tappable onTap={onFilter}>
              <FilterIcon color={COLOR_X.TO_DO_HEADER} />
            </Tappable>
            <Spacer size="normal" />
            <Tappable onTap={onSort}>
              <SwapVerticalIcon color={COLOR_X.TO_DO_HEADER} />
            </Tappable>
          </>
          <Spacer size="x-small" />
        </Stack>

      </Stack>
    ) : null;
  }

  const renderItem = ({ item }: { item: ToDoListResponse }, rowMap: any) => {
    const rowHeightAnimatedValue = new Animated.Value(200);

    return (
      <VisibleItem
        data={item as ToDoListResponse}
        rowHeightAnimatedValue={rowHeightAnimatedValue}

        itemId={item.nid}
      />
    );
  };


  return (
    <Stack fill>
      <SwipeList data={sortedListData} renderItem={renderItem} renderHeader={renderHeader} refreshing={refreshing} onRefresh={onRefresh} onEdit={onEditToDoTap} onDelete={onDeleteToDoTap} itemHeight={listItemHeight} />
    </Stack>
  );
}


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f8f8f8',
    // padding: 10,
    // marginHorizontal: 10,
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
    justifyContent: 'space-between',

  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "#000",
    marginBottom: 2,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  itemSubTitle: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 4,
  },
  itemLocation: {
    // flexDirection: 'row',
  },
  itemImage: {
    width: 150,
    height: "100%",
    borderRadius: 6,
  },
  itemLocationText: {
    fontSize: 14,
    color: '#606060',
    marginRight: 8,
  },
  itemInfo: {
    position: 'absolute',
    top: 0,
    right: 16,
  },
  itemInfoText: {
    fontSize: 12,
    color: '#606060',
    marginBottom: 4,
  },
})

const ToDoListView = React.memo(ToDoListViewComponent);
export default ToDoListView;
