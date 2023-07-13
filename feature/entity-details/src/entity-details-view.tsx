import { DataView } from "@immotech-component/data-view";
import { Text } from "@immotech-component/text";
import { EntityType } from "@immotech-feature/entity-api";
import { COLOR_X } from "@immotech-feature/theme";
import { Stack } from "native-x-stack";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  entity?: EntityType;
  loading?: boolean;
  error?: Error | null;
  entityId?: string;
}

export function EntityDetailsView({ entity, loading, error, entityId }: Props) {
  const { t } = useTranslation();

  return (
    <DataView data={entity} isLoading={loading}>
      <Stack
        fillHorizontal
        horizontal
        alignCenter
        padding={["horizontal:normal", "vertical:small"]}
        paddingTop={0}
      >
        <Stack fill alignLeft>
          <Text textColor={COLOR_X.ACCENT2} fontSize="small">
            ID
          </Text>
          <Text fill textColor={COLOR_X.ACCENT3} fontSize="normal">
            {entity?.field_account_entity_id?.und?.[0]?.value}
          </Text>
        </Stack>
        <Stack fill alignCenter>
          <Text textColor={COLOR_X.ACCENT2} fontSize="small">
            {t("entities_list.zip_code")}
          </Text>
          <Text fill textColor={COLOR_X.ACCENT3} fontSize="normal" alignCenter>
            {entity?.field_account_entity_postalcode?.und?.[0]?.value}
          </Text>
        </Stack>
        <Stack fill alignRight>
          <Text textColor={COLOR_X.ACCENT2} fontSize="small">
            {t("entities_list.city")}
          </Text>
          <Text fill textColor={COLOR_X.ACCENT3} fontSize="normal" alignRight>
            {entity?.field_account_entity_city?.und?.[0]?.value}
          </Text>
        </Stack>
      </Stack>
    </DataView>
  );
}
