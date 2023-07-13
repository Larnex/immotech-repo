/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { THEMES } from "@immotech-feature/theme";
import { THEME, ThemeProvider } from "native-x-theme";
import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import "../../i18n.config";
import { store } from "../../redux/store";
import { RootStack } from "../../screens/src/navigation/root-stack";

const queryClient = new QueryClient();



const Section: React.FC<{
  title: string
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <SafeAreaProvider>
     <Provider store={store}>
        <ThemeProvider
          theme={THEME.LIGHT}
          themes={THEMES}
          autoSwitchTheme={false}
        >
           <StatusBar barStyle="dark-content" backgroundColor="#FFF" animated />
          <QueryClientProvider client={queryClient}>
           {/* <AuthProvider> */}
              <ActionSheetProvider>
                <RootStack />
              </ActionSheetProvider>
            {/* </AuthProvider>  */}
          </QueryClientProvider> 
        </ThemeProvider> 
      </Provider> 
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App
