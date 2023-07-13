import { DataView, EmptyMessage } from "@immotech-component/data-view";
import { PDFIcon } from "@immotech-component/icons";
import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import { Spacer } from "native-x-spacer";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import { COLOR } from "native-x-theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  protocols: any;
  loading: boolean;
  error?: any;
  onSelect?: (uri: string, title: string) => void;
  onRefresh?: () => void;
}

const ProtocolPdfListView = ({
  protocols,
  loading,
  error,
  onSelect,
  onRefresh,
}: Props) => {
  const { t } = useTranslation();

  const renderItem = React.useCallback(
    ({ item }: any) => {
      return (
        <Stack style={styles.cardContainer}>
          <TouchableOpacity
            onPress={() => onSelect!(item.url, item.filename)}
            activeOpacity={0.8}
          >
            <Stack style={styles.itemContainer}>
              <PDFIcon />
              <Spacer size="small" />
              <Stack style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.filename}</Text>
                <Text>
                  {t("main.created")}:{" "}
                  {new Date(item.timestamp * 1000).toLocaleString("en-GB")}
                </Text>
              </Stack>
            </Stack>
          </TouchableOpacity>
        </Stack>
      );
    },
    [onSelect]
  );

  return protocols ? (
    <Stack fill>
      <DataView
        fill
        data={protocols}
        error={error}
        isLoading={loading}
        emptyMessage={<EmptyMessage title="No protocols">No protocols</EmptyMessage>}
      >
        <FlatList
          data={protocols}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        />
      </DataView>
    </Stack>
  ) : null;
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
});

export default ProtocolPdfListView;
