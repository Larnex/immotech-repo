import { TabBarInteraction } from "@immotech-component/button-micro-interaction";
import { DataView } from "@immotech-component/data-view";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { UnitInputType } from "@immotech-feature/unit-api";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';


interface Props {
  unit?: UnitInputType;
  loading?: boolean;
  error?: Error | null;
  unitId?: string;
  onOpenMap: (lon: string, lat: string) => void;
  types?: any;
  onToDoListTap?: (propertyID?: string, id?: string, internalID?: string, title?: string) => void;
  onMaintenanceListTap?: (propertyID?: string, id?: string, title?: string) => void;
}

export function UnitDetailsView({
  unit,
  loading,
  error,
  onOpenMap,
  types,
  onToDoListTap,
  onMaintenanceListTap,
}: Props) {
  const { t } = useTranslation();

  const type = unit?.field_utilization_unit_typ;

  return (
    <Stack>
      <DataView data={unit} isLoading={loading}>
        <Stack
          fillHorizontal
          horizontal
          padding={["horizontal:normal", "vertical:small"]}
        >
          <Stack fill maxWidth={"50%" as any} alignLeft>
            <Stack alignLeft>
              <Text textColor={COLOR_X.ACCENT2} fontSize="small" alignLeft>
                ID
              </Text>
            </Stack>
            <Stack alignLeft>
              <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignLeft>
                {unit?.field_utilization_unit_id?.und?.[0]?.value ?? unit?.nid}
              </Text>
            </Stack>
            <Spacer size="x-small" />
            <Stack alignLeft>
              <Text textColor={COLOR_X.ACCENT2} fontSize="small" alignCenter>
                {t("properties_details.type")}
              </Text>
              <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignCenter>
                {Array.isArray(type) ||
                  type === undefined ||
                  types === undefined
                  ? "No Type"
                  : types[type.und[0].tid ?? type.und[0]]}
              </Text>
            </Stack>
            <Spacer size="x-small" />
            <Stack alignLeft>
              <Text textColor={COLOR_X.ACCENT2} fontSize="small" alignRight>
                {t("properties_details.address")}
              </Text>
              <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignRight>
                {unit?.field_utilization_unit_address.und[0].thoroughfare}
              </Text>
              <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignRight>
                {unit?.field_utilization_unit_address.und[0].postal_code}{" "}
              </Text>
              <Text textColor={COLOR_X.ACCENT3} fontSize="normal" alignRight>
                {unit?.field_utilization_unit_address.und[0].locality}
              </Text>
            </Stack>
          </Stack>

        </Stack>
      </DataView>
    </Stack>
  );
}
