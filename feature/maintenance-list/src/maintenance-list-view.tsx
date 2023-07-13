import { Button } from "@immotech-component/button";
import { SwipeList } from "@immotech-component/swipe-list";
import { Text } from "@immotech-component/text";
import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { COLOR_X } from "@immotech-feature/theme";
import {
  FilterIcon, SearchIcon, SwapVerticalIcon
} from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback
} from "react-native";
import PlaceholderImage from '../../../component/assets/default-building.4e26911c4ea17f38f4e8.jpg';
import { listStyles as styles } from "@immotech-component/horizontal-lists-styles";



interface Props {
  maintenance: MaintenanceListResponse[] | [];
  parentId?: string;
  onSelect?: (id: string, internalID?: string, assignedEntity?: string, type?: string) => void;
  onEditMaintenanceTap?: (id: string) => void;
  loading?: boolean;
  onFilterIconTap?: () => void;
  searchActive?: boolean;
  filterHeaderActive?: boolean;
  onClearSearchTap?: () => void;
  onSearchIconTap?: () => void;
  onAddProtocolTap?: (id: string, newProtocol: boolean) => void;
  onOpenProtocolsPdfTap?: (id: string) => void;
  onDeleteMaintenanceTap?: (id: string, internalMaintenanceID: string) => void;
  onAddMaintenanceTap?: () => void;
  error?: Error | null;
  refreshing: boolean;
  onRefresh: () => void;
  onSortIconTap?: () => void;
  byMaintenanceName?: boolean;
  byType?: boolean;
  byDateStart?: boolean;
  byDateEnd?: boolean;
}

export function MaintenanceListView({
  maintenance,
  parentId,
  onSelect,
  onEditMaintenanceTap,
  loading,
  onFilterIconTap,
  searchActive,
  filterHeaderActive,
  onSearchIconTap,
  onClearSearchTap,
  onAddProtocolTap,
  onOpenProtocolsPdfTap,
  onDeleteMaintenanceTap,
  onAddMaintenanceTap,
  refreshing,
  onRefresh,
  error,
  onSortIconTap,
  byMaintenanceName,
  byType,
  byDateStart,
  byDateEnd,
}: Props) {

  const { t } = useTranslation();


  const createListData = (maintenance: MaintenanceListResponse[]) => {
    return maintenance?.map((item, index) => {
      return {
        key: index,
        title: item.title,
        nid: item.nid,
        assigned_entity_id: item.assigned_entity_id,
        assigned_entity_type: item.assigned_entity_type,
        assigned_entity_title: item.assigned_entity_title,
        type: item.type,
        location: item.location,
        created: item.created,
        name: item.name,
        images: item.images,
        todosAmount: item.todosAmount
      }
    })
  }

  const [listData, setListData] = React.useState<MaintenanceListResponse[]>(createListData(maintenance));
  const [sortByName, setSortByName] = React.useState<boolean | undefined>(byMaintenanceName);
  const [sortByType, setSortByType] = React.useState<boolean | undefined>(byType);
  const [sortByDateStart, setSortByDateStart] = React.useState<boolean | undefined>(byDateStart);
  const [sortByDateEnd, setSortByDateEnd] = React.useState<boolean | undefined>(byDateEnd);

  const [listItemHeight, setListItemHeight] = React.useState<number>(0);
  const [isListItemHeightSet, setIsListItemHeightSet] = React.useState<boolean>(false);

  useEffect(() => {
    setListData(createListData(maintenance))
  }, [maintenance]);

  const sortedListData = React.useMemo(() => {
    let sortedArray = [...listData];

    if (sortByName) {

      sortedArray = listData.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        } else {
          return (a.name! || a.title!).localeCompare(b.name! || b.title!);
        }
      });
    }

    if (sortByDateStart) {
      sortedArray = listData.sort((a, b) => {
        if (+a.created! > +b.created!) {
          return -1;
        }
        if (+a.created! < +b.created!) {
          return 1;
        }
        return 0;
      });
    }

    if (sortByDateEnd) {
      sortedArray = listData.sort((a, b) => {
        if (+a.created! < +b.created!) {
          return -1;
        }
        if (+a.created! > +b.created!) {
          return 1;
        }
        return 0;
      });
    }

    if (sortByType) {
      sortedArray = listData.sort((a, b) => {
        if (a.type < b.type) {
          return -1;
        }
        if (a.type > b.type) {
          return 1;
        }
        return 0;
      });
    }

    return sortedArray;

  }, [sortByDateEnd, sortByDateStart, sortByType, sortByName, listData, maintenance]);

  const renderHeader = React.useCallback(
    () => (
      <Header
        searchActive={searchActive}
        onFilter={onFilterIconTap}
        onSearch={onSearchIconTap}
        filterHeaderActive={filterHeaderActive}
        onClearSearchTap={onClearSearchTap}
        onSort={onSortIconTap}
      ></Header>
    ),
    [searchActive, onSearchIconTap, filterHeaderActive, onFilterIconTap]
  );

  function Header({
    searchActive,
    onFilter,
    onSearch,
    filterHeaderActive,
    onClearSearchTap,
    onSort,
  }: {
    searchActive?: boolean;
    filterHeaderActive?: boolean;
    onFilter?: () => void;
    onSearch?: () => void;
    onClearSearchTap?: () => void;
    onSort?: () => void;
  }) {
    return filterHeaderActive ? (
      <Stack alignMiddle>
        <Stack
          paddingHorizontal={16}
          horizontal
          alignRight
          alignMiddle
          paddingVertical={8}
        >
          {searchActive ? (
            <Button
              clear
              textColor={COLOR_X.MAINTENANCE_HEADER}
              size="small"
              onTap={onClearSearchTap}
            >
              {t("main.clear_search")}
            </Button>
          ) : null}

          <>
            <Tappable onTap={onSearch}>
              <SearchIcon color={COLOR_X.MAINTENANCE_HEADER} />
            </Tappable>
            <Spacer size="small" />
            <Tappable onTap={onFilter}>
              <FilterIcon color={COLOR_X.MAINTENANCE_HEADER} />
            </Tappable>
            <Spacer size="small" />
            <Tappable onTap={onSort}>
              <SwapVerticalIcon color={COLOR_X.MAINTENANCE_HEADER} />
            </Tappable>
          </>
        </Stack>

      </Stack>
    ) : null;
  }

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
            onPress={() => onSelect && onSelect(itemId, data?.title, data?.assigned_entity_title, data?.type,)}
            activeOpacity={0.8}
          >
            <Stack style={styles.itemContainer}>
              <Image source={data.images ? { uri: data.images[0] } : PlaceholderImage} style={styles.itemImage} />
              <Stack style={styles.overlayContainer}>
                {!!data.todosAmount && (
                  <Text style={styles.overlayText}>
                    {data.todosAmount}{" "}
                    {data.todosAmount === 1 ? "ToDo" : "ToDo's"}
                  </Text>
                )}</Stack>

              <Stack style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1} textColor={COLOR_X.SECONDARY}>{data.name ?? data.title}</Text>
                <Stack alignMiddle>
                  <Text bold textColor={COLOR_X.BLACK}>{t(`main.${data.assigned_entity_type}`)}: {data.assigned_entity_title}</Text>
                </Stack>
                {/* <Text style={styles.itemSubtitle}>ID: {data.nid}</Text> */}
                <Text style={styles.itemSubtitle}>{data.type}</Text>

                <Stack style={styles.itemLocation}>
                  <Text style={styles.itemLocationText}>{data.location}</Text>
                </Stack>
              </Stack>
            </Stack>
          </TouchableOpacity>
        </Stack>
      </TouchableWithoutFeedback>
    );
  };

  const renderItem = (
    { item }: { item: MaintenanceListResponse },
    rowMap: any
  ) => {

    return (
      <VisibleItem
        data={item as MaintenanceListResponse}
        itemId={item.nid}
      />
    );
  };


  return (
    <Stack fill>
      {(maintenance.length !== 0 || searchActive) && !parentId && (
        renderHeader()
      )}
      {!!parentId && maintenance.length !== 0 && (
        <Stack horizontal >
          <Stack
            horizontal fillHorizontal alignCenter
            padding={["vertical:small"]}
          >
            <Stack>
              <Button
                rounded={true}
                textColor={COLOR_X.PRIMARY}
                onTap={() => onAddProtocolTap!(parentId!, true)}
                fontSize={14}
                padding={0}
                size={"small"}
              >
                {t("protocol.start_protocol")}
              </Button>

            </Stack>
            <Spacer size="small" />
            <Stack

            >
              <Button
                rounded={true}
                textColor={COLOR_X.PRIMARY}
                backgroundColor={COLOR_X.ACCENT}
                onTap={() => onAddProtocolTap!(parentId!, false)}
                fontSize={14}
                padding={0}
                size={"small"}

              >
                {t("protocol.continue_protocol")}
              </Button>

            </Stack>
          </Stack>
        </Stack>
      )}


      <SwipeList data={sortedListData} renderItem={renderItem} refreshing={refreshing} onRefresh={onRefresh} onEdit={onEditMaintenanceTap} onDelete={onDeleteMaintenanceTap} itemHeight={listItemHeight} />
    </Stack>
  );
}

export default MaintenanceListView;
