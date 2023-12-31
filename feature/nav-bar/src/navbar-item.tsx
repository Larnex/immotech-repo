import { COLOR_X } from "@immotech-feature/theme";
import { ParamListBase, TabNavigationState } from "@react-navigation/core";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { Pressable } from "react-native";

interface Props {
  name: string;
  state: TabNavigationState<ParamListBase>;
  children?: React.ReactNode;
  onTap: () => void;
}

export function NavBarItem({ name, children, state, onTap }: Props) {
  const { index, routeNames } = state;
  const active = index === routeNames.indexOf(name);
  return (
    <Pressable onPress={onTap}>
      <Stack
        backgroundColor={active ? COLOR_X.PAGE : COLOR.PRIMARY}
        padding="normal"
        borderRadius="round"
      >
        {children}
      </Stack>
    </Pressable>
  );
}
