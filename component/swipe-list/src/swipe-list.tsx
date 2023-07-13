import { styles } from "@immotech-component/swipe-list-styles";
import { Entity } from "@immotech-feature/entity-api";
import { MaintenanceListResponse } from "@immotech-feature/maintenance-api";
import { PropertyListResponse } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { ToDoListResponse } from "@immotech-feature/todo-api";
import { UnitResponse } from "@immotech-feature/unit-api";
import {
  PencilIcon,
  TrashIcon
} from "native-x-icon";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Animated, RefreshControl, TouchableOpacity } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
interface Props {
  data: (Entity | PropertyListResponse | ToDoListResponse | MaintenanceListResponse | UnitResponse)[];
  renderItem: (rowData: any, rowMap: any) => JSX.Element;
  renderHeader?: () => JSX.Element;
  refreshing: boolean;
  onRefresh?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string, internalID: string, parentId?: string) => void;
  itemHeight?: number;
}


export const SwipeList = ({ data, renderItem, renderHeader, refreshing, onRefresh, onEdit, onDelete, itemHeight }: Props) => {
  const [dataState, setDataState] = React.useState([...data]);

  React.useEffect(() => {
    setDataState([...data]);
  }, [data]);

  const { t } = useTranslation();

  const closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: any, rowKey: any, itemId: string, internalItemId: string, parentId: string) => {
    Alert.alert(
      `${t("delete.first_message")}`,
      `${t("delete.second_message")}`,
      [
        {
          text: `${t("delete.delete")}`,
          onPress: () => {
            closeRow(rowMap, rowKey);


            const newData = [...dataState];
            const prevIndex = dataState.findIndex((item) => item.key === rowKey);

            onDelete!(itemId, internalItemId ?? `todo:${itemId}`, parentId);
            newData.splice(prevIndex, 1);
            setDataState(newData);
          },
        },
        {
          text: `${t("delete.cancel")}`,
          onPress: () => closeRow(rowMap, itemId),
        },
      ]
    );
  };


  const HiddenItemWithActions = (props: any) => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onDelete,
    } = props;

    const onRowActionChange = (
      Animated.event(
        [{ nativeEvent: { value: rowActionAnimatedValue } }],
        { useNativeDriver: true }
      ));


    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: rightActionActivated ? 500 : 75,
        useNativeDriver: true,
      }).start();
    }

    return (
      <Animated.View
        style={{
          height: itemHeight,
          transform: [
            {
              scale: swipeAnimatedValue.interpolate({
                inputRange: [-90, -45],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        {!leftActionActivated && (
          <TouchableOpacity
            style={[
              styles.backRightBtn,
              styles.backRightBtnLeft,
              { marginRight: 10, marginTop: 5 },
            ]}
            onPress={onClose}
          >
            <PencilIcon color={COLOR_X.PRIMARY} size={25} />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
                marginRight: 10,
                marginTop: 5,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}
            >
              <Animated.View
                style={[
                  styles.trash,

                ]}
              >
                <TrashIcon color={COLOR_X.PRIMARY} size={25} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data: any, rowMap: any) => {


    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);


    const onDeleteRow = () => {
      deleteRow(rowMap, data.item.key, data.item.nid, data.item.id ?? data.item.title, data.item.parentId ?? data.item.assigned_entity_id);
    };

    const onEditRow = () => {
      onEdit!(data.item.nid);
    };

    return (
      <HiddenItemWithActions
        swipeAnimatedValue={data.dragAnimatedValue}
        leftActionActivated={data.leftActionActivated}
        rightActionActivated={data.rightActionActivated}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={onEditRow}
        onDelete={onDeleteRow}
      />
    );
  };





  return (

    <SwipeListView
      data={data}
      useFlatList={true}
      renderItem={(dataState, rowMap) => {
        return renderItem(dataState, rowMap)
      }}
      initialNumToRender={1}
      ListHeaderComponent={renderHeader}
      renderHiddenItem={renderHiddenItem}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      keyExtractor={(rowData) => {
        return rowData?.nid! ?? rowData?.title;
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      rightOpenValue={-150}
      disableRightSwipe
      closeOnRowPress={true}
      stopRightSwipe={-150}
    />

  )
}
