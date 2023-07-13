import React, { useState } from 'react';
import { StyleSheet, TextInput, Modal } from 'react-native';
import { Stack } from 'native-x-stack';
// import { TextInput } from '@immotech-component/text-input';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from 'native-x-icon';
import { COLOR_X } from '@immotech-feature/theme';
// import { Modals } from '@immotech/screens';
import { Modals } from '@immotech/screens';
import { SearchResultModal } from '@immotech/screens/src/search-result/search-result-modal';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@immotech-component/text';
import { Tappable } from "native-x-tappable";



export const GlobalSearchComponent = () => {
  const { t } = useTranslation();

  const { navigate, push } = useNavigation<any>();

  const navigateToSearchModal = React.useCallback(() => {
    push(Modals.SearchResult)
  }, [push])



  return (
    <Stack style={styles.container}>
      <Tappable style={styles.searchContainer} onTap={navigateToSearchModal}>
        <Stack horizontal alignMiddle>
          <SearchIcon size={32} color={COLOR_X.PLACEHOLDER_TEXT} />

          <Text style={styles.searchInput} textColor={COLOR_X.PLACEHOLDER_TEXT}>
            {`${t('main.search_by_name')}`}
          </Text>
        </Stack>
      </Tappable>

    </Stack>
  )
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2EA',
    borderRadius: 16,
    height: 60,
    paddingHorizontal: 8,

  },
  searchInput: {
    fontSize: 16,
    marginLeft: 10,
  }
});

export const GlobalSearch = React.memo(GlobalSearchComponent);
