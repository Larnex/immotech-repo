import { Icon } from "@immotech-component/icon-component";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { EyeIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor, SharedValue, useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from "react-native-reanimated";
import {useTranslation} from "react-i18next";
import {Spacer} from "native-x-spacer";


const AnimatedButton = Animated.createAnimatedComponent(Pressable);

interface IconsComponentProps {
  iconsValue: SharedValue<number>;
  index: number;
  item: {
    icon: string;
    tap?: () => void;
  } ;
  delay?: number;
  size?: number;
}

const IconsComponent = ({ iconsValue, index, item, delay = 50, size = 26 }: IconsComponentProps) => {
  const {t} = useTranslation();
  const iconsDerivedValue = useDerivedValue(() => {
    return withDelay(index + delay, withSpring(iconsValue.value));
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // marginTop: 5,
      transform: [
        {
          // translateY: interpolate(iconsDerivedValue.value, [0, 1], [0, 80]),
          translateX: interpolate(iconsDerivedValue.value, [0, 1], [0, 80]),
        },
      ],
      opacity: interpolate(iconsDerivedValue.value, [0, 1], [0, 1]),
    };
  });

  const selectStyle = () => {
    if (item.icon) {

      switch (item.icon) {
        case "todo":
          return styles.todoIcon;
          case "maintenance":
            return styles.maintenanceIcon;
            case "unit":
              return styles.iconUnit;
              case "map":
                return styles.iconMap;
              }
            }
  };

  return (
    <AnimatedButton
      style={[selectStyle(), styles.icon]}
      onPress={item.tap}
    >
      <Icon name={item.icon} size={20} />
      <Spacer size="x-small"/>
      <Text fontSize={15} textColor={COLOR_X.PRIMARY}>{item.icon === 'map' ? t("properties_details.map") : item.icon === 'maintenance' ? t("main.maintenance") : "ToDo"}</Text>
    </AnimatedButton>
  );
};

interface Props {
  onAddUnitTap?: () => void;
  onAddDamageTap?: () => void;
  onAddMaintenanceTap?: () => void;
  mode?: "view" | "add";
  unit?: boolean;
  onMaintenanceListTap?: () => void;
  onTodoListTap?: () => void;
  onOpenMap?: () => void;
}

export const TabBarInteraction = ({
  onAddDamageTap,
  onAddUnitTap,
  onAddMaintenanceTap,
  onMaintenanceListTap,
  onTodoListTap,
  onOpenMap,
  mode,
  unit,
}: Props) => {
  const [open, setOpen] = React.useState(true);

  const contHeightValue = useSharedValue(1);
  const contWidthValue = useSharedValue(1);
  const iconsValue = useSharedValue(1);
  const circleValue = useSharedValue(1);
  const backgroundColorValue = useSharedValue(1);
  const plusLineColor = useSharedValue(1);

  const contHeightStyle = useAnimatedStyle(() => {
    const contHeight = interpolate(contHeightValue.value, [0, 1], [80, 80]);
    return {
      height: contHeight,
    };
  });

  const contWidthStyle = useAnimatedStyle(() => {
    const contWidth = interpolate(contWidthValue.value, [0, 1], [80, 360]);

    return {
      width: contWidth,
    };
  });

  const iconPlusStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      marginTop: 15,
      marginLeft: 10,
      backgroundColor: interpolateColor(
        backgroundColorValue.value,
        [0, 1],
        ["#7899D4", "#222e5c"]
      ),
      transform: [
        {
          rotate: `${interpolate(
            contHeightValue.value,
            [0, 1],
            [0, mode == "view" ? 180 : 134]
          )}deg`,
        },
      ],
    };
  });
  const iconPlusLineStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        plusLineColor.value,
        [0, 1],
        ["white", "#F36C65"]
      ),
    };
  });

  const iconCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(circleValue.value, [0, 0.3], [0, 1]),
        },
      ],
      opacity: interpolate(circleValue.value, [0, 1], [1, 0]),
    };
  });

  const onFocus = () => {
    contHeightValue.value = withTiming(1, { duration: 300 });
    iconsValue.value = withTiming(1, { duration: 50 });
    circleValue.value = withTiming(1, { duration: 300 }, () => {});
    backgroundColorValue.value = withTiming(1, { duration: 700 });
    plusLineColor.value = withTiming(1, { duration: 300 });
    contWidthValue.value = withTiming(1, { duration: 300 });
  };

  const onBlur = () => {
    contHeightValue.value = withTiming(0, { duration: 250 });
    iconsValue.value = withTiming(0, { duration: 1 });
    backgroundColorValue.value = withTiming(0, { duration: 1000 });
    plusLineColor.value = withTiming(0, { duration: 600 });
    circleValue.value = 0;
    contWidthValue.value = withTiming(0, { duration: 250 });
  };

  return (
    <Stack   >
      
        <Stack style={styles.iconsContainer} horizontal fillHorizontal>
          {[
            !unit &&
              (mode !== "view"
                ? { icon: "unit", tap: onAddUnitTap }
                : { icon: "map", tap: onOpenMap }),

            ,
            {
              icon: "maintenance",
              tap: mode == "view" ? onMaintenanceListTap : onAddMaintenanceTap,
            },
            {
              icon: "todo",
              tap: mode == "view" ? onTodoListTap : onAddDamageTap,
            },
          ].map((item, index) => {
            return (
              <IconsComponent key={index} {...{ iconsValue, index, item }} />
            );
          })}
        </Stack>
        </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  button: {
    // width: "100%",
    height: 80,
    borderRadius: 100,
    backgroundColor: "#EFF2F7",
    // justifyContent: "center",
    // position: "relative",
    // overflow: "hidden",
    zIndex: 2000,
  },

  iconsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    // alignItems: "center",
    justifyContent: "space-around",
    // textAlignVertical: "center",
  },

  onBlur: {
    backgroundColor: "white",
    // width: 1000,
    // height: 190,
    // borderRadius: 30,
    // position: "absolute",
    // bottom: "41%",
  },
  text: {
    fontSize: 30,
    color: "white",
  },
  icon: {
    width: "32%",
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconUnit: {
    backgroundColor: "#3F784C",
    // marginRight: 6,
    // marginLeft: 10,
  },

  iconMap: {
    backgroundColor: "#554971",
    // marginRight: 6,
    // marginLeft: 10,
  },

  todoIcon: {
    backgroundColor: "#3AB795",
    // marginRight: 6,
    // marginLeft: 10,
  },

  maintenanceIcon: {
    backgroundColor: "#39A0ED",
    // marginRight: 6,
    // marginLeft: 10,
  },

  circle: {
    backgroundColor: "rgba(242, 36, 36, 0.4)",
    width: 60,
    height: 60,
    position: "absolute",
    // borderRadius: 100,
    // bottom: "50%",
    zIndex: 1000,
  },

  plusLine: {
    position: "absolute",
    width: 24,
    height: 3,
    transform: [
      {
        rotate: 90 + "deg",
      },
    ],
    borderRadius: 4,
  },
  plusLine1: {
    // width: 24,
    // height: 3,
    // borderRadius: 3,
    // backgroundColor: "black",
  },
  plusCont: {
    // width: 60,
    // height: 60,
    // borderRadius: 100,
    // alignItems: "center",
    // justifyContent: "center",
  },
  fake: {
    // width: 100,
    // height: 40,
    // position: "absolute",
    // bottom: 0,
    // zIndex: -1,
    // backgroundColor: "#FA3",
  },
});

