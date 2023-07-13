import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import { TextInput } from "@immotech-component/text-input";
import { TopSheet } from "@immotech-component/top-sheet";
import { COLOR_X } from "@immotech-feature/theme";
import { useOpenClose } from "@immotech/util";
import { RouteProp, useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import { SearchIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React, { useEffect } from "react";
import { Modal } from "react-native";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";

type SearchModalParamList = {
  [Modals.Search]: {
    target?: Screens;
  };
};

export function SearchModal() {
  const { params } = useRoute<RouteProp<SearchModalParamList>>();
  const { target } = params ?? {};

  const getDefaultSearchField = (target: any) => {
    if (target === "PROPERTIES_HOME" || target === "ENTITIES_HOME") {
      return "name";
    } else if (target === "TODOS_HOME") {
      return "nid";
    } else if (target === "MAINTENANCE_HOME") {
      return "name";
    }
    return "";
  };

  const [searchKey, setSearchKey] = React.useState<string>("");
  const [searchBy, setSearchBy] = React.useState<string>(getDefaultSearchField(target));
  const [visible, open, close] = useOpenClose(true);
  const { navigate, goBack } = useNavigation<any>();



  const searchFieldsToDo = React.useMemo(
    () => [
      {
        label: "ToDo's id",
        value: "nid",
      },

      {
        label: `${t("todo.list.short_desc")}`,
        value: "shortDescription",
      },
      {
        label: `${t("todo.list.long_desc")}`,
        value: "longDescription"
      },
      {
        label: `${t("main.parent_container")}`,
        value: "parentName"
      }
    ],
    []
  );



  const searchFieldsProperty = React.useMemo(
    () => [
      {
        label: "Name",
        value: "name",
      },
      {
        label: `${t("entities_list.internal_number")}`,
        value: "internalNumber",
      },
      {
        label: `${t("entities_list.city")}`,
        value: "city",
      },
      {
        label: `${t("entities_list.zip_code")}`,
        value: "zipCode",
      },
    ],
    []
  );

  const searchFieldsMaintenance = React.useMemo(
    () => [
      {
        label: "Name",
        value: "name",
      },

      {
        label: `${t("tga.manufacturer")}`,
        value: "manufacturer",
      },
      {
        label: `${t("main.parent_container")}`,
        value: "parentName"
      }
    ], []);




  const onSearchTap = () => {
    close();
    if (params.target) {
      navigate({
        name: params.target,
        params: { [searchBy]: searchKey },
        merge: true,
      });
    }
  };

  const onClose = () => {
    if (visible) {
      goBack();
    }
  };

  useEffect(() => {
    open();
  }, [open]);

  return (
    <Modal visible transparent>
      <TopSheet visible={visible} onClose={onClose}>
        <Stack fill padding="horizontal:large" backgroundColor={COLOR_X.PAGE}>
          <Spacer fill />
          <Text alignCenter>{t("main.search")}</Text>
          <Spacer />

          <Picker
            value={searchBy}
            placeholder={`${t("main.select_parameter")}`}
            onChange={setSearchBy}
            items={
              target?.toString() == "TODOS_HOME"
                ? searchFieldsToDo
                : target?.toString() === "PROPERTIES_HOME" ||
                  target?.toString() === "ENTITIES_HOME"
                  ? searchFieldsProperty
                  : target?.toString() === "MAINTENANCE_HOME" ?
                    searchFieldsMaintenance : []
            }
          />
          <Spacer />
          <Stack
            fillHorizontal
            border
            borderColor={COLOR.TERTIARY}
            backgroundColor={COLOR.DIVIDER}
            borderRadius="normal"
            padding="horizontal:normal"
          >
            <TextInput
              fill
              height={42}
              padding="none"
              placeholder={`${t("main.search")}...`}
              autoFocus
              placeholderColor={COLOR.TERTIARY}
              borderColor={COLOR.TRANSPARENT}
              backgroundColor={COLOR.DIVIDER}
              value={searchKey}
              onChangeText={setSearchKey}
              returnKeyType="search"
              onSubmitEditing={onSearchTap}
              rightIcon={
                <Tappable onTap={onSearchTap}>
                  <SearchIcon
                    color={
                      searchKey.length > 0 ? COLOR.TERTIARY : COLOR.DISABLED
                    }
                  />
                </Tappable>
              }
            />
          </Stack>
          <Spacer size="small" />
        </Stack>
      </TopSheet>
    </Modal>
  );
}
