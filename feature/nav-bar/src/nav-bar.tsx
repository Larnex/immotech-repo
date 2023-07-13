import { COLOR_X } from "@immotech-feature/theme";
import { CreateEntryModal } from "@immotech/screens/src/navigation/create-entry-modal";
import { getCurrentScreenName } from "@immotech/util/src/navigation-helpers";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AddIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export function NavBar({ state, descriptors, navigation, navState }: BottomTabBarProps & { navState: any }) {


  const [isCreateEntryOpen, setIsCreateEntryOpen] = React.useState(false);

  const addIconAnimation = React.useRef(new Animated.Value(0)).current;

  const focusedOptions = descriptors[state?.routes[state.index]?.key]?.options;

  const currentScreen = getCurrentScreenName(navState);

  const handleAddButtonPress = () => {
    setIsCreateEntryOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    Animated.spring(addIconAnimation, {
      toValue: isCreateEntryOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isCreateEntryOpen]);

  const addIconStyle = {
    transform: [
      {
        rotate: addIconAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const isModalOpen = (isOpen: boolean | null) => {
    if (!isOpen) {
      handleAddButtonPress();
    }
  };

  // Hide tabBar if display style is set as none for any screens
  if ((focusedOptions.tabBarStyle as any)?.display === "none") {
    return null;
  }

  if (currentScreen?.name === "PROTOCOL_SCREEN" || currentScreen?.name === "PROTOCOL_LIST" || currentScreen?.name === "PROTOCOL_PDF_VIEW") {
    return null;
  }


  return (
    <>
      <Stack overflowVisible backgroundColor={COLOR.PRIMARY}>
        <Stack
          backgroundColor={COLOR_X.NAVBAR_BG} overflowVisible alignCenter
        >
          <SafeAreaView >
            <Stack
              horizontal
              alignMiddle
              alignCenter
              overflowVisible

              padding={["vertical:x-small", "horizontal:normal"]}
              style={{
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
              }}
            >
              <Tappable onTap={handleAddButtonPress}>
                <Animated.View style={styles.addIconContainer}>
                  <Animated.View style={[styles.addIconWrapper, addIconStyle]}>

                    <AddIcon color={COLOR_X.ACCENT} size={40} />
                  </Animated.View>
                </Animated.View>
              </Tappable>
            </Stack>
          </SafeAreaView>
        </Stack>
      </Stack>
      {isCreateEntryOpen && <CreateEntryModal currentScreen={currentScreen!.name!} isOpen={isCreateEntryOpen} isModalOpen={isModalOpen} />
      }
    </>
  );
}

const styles = StyleSheet.create({

  addIconContainer: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width: 65,
    height: 65,

  },

  addIconWrapper: {
    backgroundColor: "#F0F2F9",
    borderRadius: 25,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

})

