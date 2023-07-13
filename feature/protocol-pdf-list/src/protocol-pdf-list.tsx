import { useProperty } from "@immotech-feature/property-api";
import { useUnit } from "@immotech-feature/unit-api";
import React, { useEffect } from "react";
import ProtocolPdfListView from "./protocol-pdf-list-view";

interface Props {
  parentId: string;
  internalID?: string;
  onSelect?: (uri: string, title: string) => void;
  type?: "property" | "unit";
}

export const ProtocolPdfList = ({ parentId, internalID, type, onSelect }: Props) => {
  const {
    data: object,
    isLoading,
    error,
    refetch
  } = type! == "property"
      ? useProperty({ nid: parentId })
      : useUnit({ nid: parentId });

  const [refreshing, setRefreshing] = React.useState(false);

  const [protocol, setProtocol] = React.useState<any>();

  useEffect(() => {
    if (object) {
      if (object.field_test_protocols.und.length! > 0) {
        setProtocol(object?.field_test_protocols.und);
      }
    }
  }, [object]);

  const onRefresh = React.useCallback(() => {
    refetch();
    setRefreshing(isLoading);
    // queryClient.invalidateQueries("property");
  }, [object, isLoading]);

  return !isLoading ? (
    <ProtocolPdfListView
      protocols={protocol}
      loading={isLoading}
      error={error}
      onSelect={onSelect}
      onRefresh={onRefresh}
    ></ProtocolPdfListView>
  ) : null;
};

