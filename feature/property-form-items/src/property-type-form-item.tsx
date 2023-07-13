import { Picker } from "@immotech-component/picker";
import { Text } from "@immotech-component/text";
import {useQuery, QueryClient} from "@tanstack/react-query";
import {useNetInfo} from "@react-native-community/netinfo"
import { usePropertyTypes } from "@immotech-feature/property-api";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import React, { useMemo } from "react";

export function PropertyTypeFormItem() {
  const queryClient = new QueryClient();
  const netInfo = useNetInfo();
  const { data: types } = usePropertyTypes();



  const {data} = useQuery({queryKey: ["property-types"], queryFn: () => {
    const cachedData = queryClient.getQueryData(['property-types']);
    if (!netInfo.isConnected && cachedData) {
      return cachedData;
    }

    return types;
  }})

  const [propertyType, setPropertyType] = React.useState(undefined);

  const categories = useMemo(
    () =>
      Object.entries(data ?? {}).map((value: any) => {
        return {
          label: value[1],
          value: value[0],
        };
      }),

    [data]
  );

  const onTypeChange = (value: any) => {
    setPropertyType(value);
  };

  return (
    <Stack fillHorizontal>
      <Text>Type </Text>
      <Spacer size="x-small" />
      <Picker
        placeholder="Choose category"
        items={categories}
        value={propertyType}
        onChange={(type: any) => onTypeChange(type)}
      />
    </Stack>
  );
}
