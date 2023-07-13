import { PageHeader } from "@immotech-component/page-header";
import { Screen } from "@immotech-component/screen";
import { Text } from "@immotech-component/text";
import { EntityDetails } from "@immotech-feature/entity-details";
import { COLOR_X } from "@immotech-feature/theme";
import { RouteProp, useRoute } from "@react-navigation/core";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import ParentIdContext from "../../../src/contexts/parent-id-context";
import { Screens } from "../navigation/screens";
import { PropertiesHome } from "../properties/properties-home";
import { Tappable } from "native-x-tappable";
import { PencilIcon } from "native-x-icon";
import { useNavigation } from "@react-navigation/native";
import { Modals } from "../navigation/modals";

type EntityDetailsParamList = {
  [Screens.EntityDetails]: { id: string; internalID: string, title?: string };
};

export function EntityDetailsScreen() {
  const { t } = useTranslation();

  const { params } = useRoute<RouteProp<EntityDetailsParamList>>();
  const { navigate, push } = useNavigation<any>();

  const { id, internalID, title } = params ?? {};
  const { setEntityId, entityId } = React.useContext(ParentIdContext);

  React.useEffect(() => {
    setEntityId(!!id ? id : internalID);
  }, [id, internalID]);

  const openEditEntityModal = React.useCallback((id: string) => {
    navigate(Modals.EditEntity, { id })
  }, [id, navigate])

  return (
    <Screen withSafeArea backgroundColor={COLOR.PRIMARY}>

      <PageHeader showBackButton accentColor={COLOR_X.ACCENT} hideGlobalSearch rightButton={
        <Tappable onTap={() => openEditEntityModal(id)}>
          <PencilIcon color={COLOR_X.BLACK} />
        </Tappable>
      }>
        <Stack alignMiddle alignCenter padding={["vertical:small"]} style={{ flexGrow: 1, maxWidth: "80%" }}>
          <Text alignCenter textColor={COLOR_X.SECONDARY} fontSize="large" bold>{t("main.entity")}: {title}</Text>
        </Stack>
      </PageHeader>

      <Stack fill backgroundColor={COLOR_X.PRIMARY} padding="vertical:x-small">
        <EntityDetails entityId={id} internalID={internalID} />

        <PropertiesHome />
      </Stack>
    </Screen>
  );
}
