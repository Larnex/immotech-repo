import { Button } from "@immotech-component/button";
import { COLOR_X } from "@immotech-feature/theme";
import { t } from "i18next";
import { CaretDownIcon, ListIcon, GridIcon, SearchIcon, SwapVerticalIcon } from "native-x-icon";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { Text } from "@immotech-component/text";

interface HeaderProps {
  searchActive?: boolean;
  onSearch?: () => void;
  onSort?: () => void;
  onClearSearchTap?: () => void;
  filterHeaderActive?: boolean;
  color?: COLOR | COLOR_X;
  onViewChange?: (view: "list" | "grid") => void;
}

export function Header({
  searchActive,
  onSearch,
  onSort,
  onClearSearchTap,
  filterHeaderActive,
  color = COLOR_X.ACCENT,
  onViewChange
}: HeaderProps) {

  const [view, setView] = React.useState<"list" | "grid">("list");
  const handleViewChange = (newView: "list" | "grid") => {
    if (onViewChange) {
      setView(newView);
      onViewChange(newView);
    }
  };


  return filterHeaderActive ? (
    <Stack padding={["horizontal:normal"]}>
      <Spacer size="xx-small" />
      <Stack horizontal fillHorizontal alignMiddle justifyBetween>
        {/* <Spacer fill /> */}

        {searchActive ? (
          <Button clear textColor={color} size="small" onTap={onClearSearchTap}>
            {t("main.clear_search")}
          </Button>
        ) : null}

        <Tappable onTap={onSearch}>
          <SearchIcon color={COLOR_X.BLACK} />
        </Tappable>

        <Spacer size="small" />
        {/* 
        <Stack horizontal alignMiddle alignCenter padding={["vertical:small", "horizontal:normal"]} style={{
          borderRadius: 32,
          borderColor: "#747C7C",
          borderWidth: 1
        }}>
          <Text textColor={COLOR_X.PLACEHOLDER_TEXT} fontSize={14} style={{
            marginRight: 8
          }}>Sort by</Text> */}
        <Tappable onTap={onSort}>
          <SwapVerticalIcon color={COLOR_X.BLACK} />
        </Tappable>
        {/* </Stack> */}

        <Spacer fill />

        <Stack horizontal alignMiddle>
          <Tappable onTap={() => handleViewChange("list")}>
            <Stack padding={['horizontal:normal', 'vertical:small']} backgroundColor={view === 'list' ? COLOR_X.HOME_SCREEN_BACKGROUND : COLOR_X.PRIMARY}
              style={{
                borderRadius: 8
              }}
            >
              <ListIcon
                color={view === "list" ? color : COLOR_X.PLACEHOLDER_TEXT}
              />
            </Stack>
          </Tappable>

          <Spacer size="small" />

          <Tappable onTap={() => handleViewChange("grid")}>
            <Stack padding={['horizontal:normal', 'vertical:small']} backgroundColor={view === 'grid' ? COLOR_X.HOME_SCREEN_BACKGROUND : COLOR_X.PRIMARY}
              style={{
                borderRadius: 8
              }}>
              <GridIcon
                color={view === "grid" ? color : COLOR_X.PLACEHOLDER_TEXT}
              />

            </Stack>
          </Tappable>
        </Stack>

      </Stack>

      <Spacer size="small" />
    </Stack>
  ) : null;
}
