import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { ThreeDModels } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { ThreeD } from "@immotech-feature/three-d";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modals } from "../navigation/modals";
import { Screens } from "../navigation/screens";

type ThreeDParamList = {
  [Screens.ThreeDView]: {
    parentId: string;
    object: "property" | "unit";
    modelType?: "outdoor" | "outdoorthermo" | "technical" | "indoor";
    timestamp?: number;
    models: ThreeDModels[];
  };
};

const ThreeDScreen = ({ modelsProp, parentIdProp, objectProp }) => {
  const { t } = useTranslation();

  const { navigate } = useNavigation<any>();

  const { params } = useRoute<RouteProp<ThreeDParamList>>();
  const { parentId, object, modelType, timestamp, models } = params ?? {};

  const navigateToFilters = () => {
    navigate(Modals.Filters, {
      target: Screens.ThreeDView,
      modelType: (modelsProp ?? models)?.map((model) => model.type),
      timestamp: (modelsProp ?? models)?.map((model) => model.timestamp),
      selectedTimestamp: timestamp,
      object: objectProp ?? object,
      models: modelsProp ?? models,
    });
  };

  return (
    <Screen withSafeArea>
      {/* <Spacer />
      <Spacer size="small" />
      <PageHeader
        showBackButton
        accentColor={
          object === "property" ? COLOR_X.SECONDARY : COLOR_X.ACCENT1
        }
      >
        <Stack horizontal alignMiddle fill alignCenter>
          <Text semiBold fontSize="x-large" textColor={COLOR.PRIMARY}>
            {t("model_types.3d_view")}
          </Text>
        </Stack>
      </PageHeader> */}

      <Stack fill>
        <ThreeD
          parentId={parentId ?? parentIdProp}
          object={object ?? objectProp}
          onFilterIconTap={navigateToFilters}
          type={modelType}
          timestamp={timestamp}
          models={models ?? modelsProp}
        // sendFilteredData={sendFilteredData}
        />
      </Stack>
    </Screen>
  );
};

export default ThreeDScreen;
