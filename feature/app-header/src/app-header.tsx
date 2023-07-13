import { Avatar } from '@immotech-component/avatar';
import { LanguagePicker } from '@immotech-component/language-picker';
import { useAuth } from '@immotech-feature/auth';
import { Logo } from "@immotech-feature/logo";
import { COLOR_X } from '@immotech-feature/theme';
import { Modals, Screens } from '@immotech/screens';
import { SearchResultModal } from '@immotech/screens/src/search-result/search-result-modal';
import { useNavigation } from '@react-navigation/native';
import { Spacer } from 'native-x-spacer';
import { Stack } from 'native-x-stack';
import { Tappable } from 'native-x-tappable';
import { COLOR } from 'native-x-theme';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = {
  container: {
    position: 'absolute' as const,
    top: 0,
    width: '100%',
    zIndex: 1,
    backgroundColor: "#fff",
  },
};


export function AppHeader() {

  const { user } = useAuth();

  const { top } = useSafeAreaInsets();

  const photoURL = user?.picture;

  const { navigate, goBack } = useNavigation<any>();

  const navigateToProfilePage = () => {
    navigate(Screens.ProfileScreen);
  };

  const [searchQuery, setSearchQuery] = React.useState('');

  const clearSearchQuery = () => {
    setSearchQuery('');
  };



  return (
    <Stack style={styles.container} overflowVisible >
      <Stack height={top} />
      <Stack horizontal fillHorizontal alignMiddle justifyBetween padding='normal'>
        <Stack width={"60%" as any} alignLeft>

          <Logo />
        </Stack>

        <Stack horizontal alignMiddle width={"40%" as any} alignRight>
          <LanguagePicker />

          <Spacer size='small' />
          <Tappable onTap={navigateToProfilePage}>
            <Avatar photoURL={photoURL && photoURL.url} />
          </Tappable>
        </Stack>
      </Stack>

    </Stack>
  );
}
