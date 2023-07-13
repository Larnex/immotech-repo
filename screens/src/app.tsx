import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AuthProvider } from "@immotech-feature/auth";
import { THEMES } from "@immotech-feature/theme";
import { OfflineHeader } from "@immotech/offline";
import { useOnlineManager } from '@immotech/util';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient, focusManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { THEME, ThemeProvider } from "native-x-theme";
import React from "react";
import { Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../../i18n.config";
import { ErrorBoundary } from "./error-screen/error-boundary";
import { RootStack } from "./navigation/root-stack";



function onAppStateChange(status: string) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: Infinity,
      retry: 5,
      networkMode: "offlineFirst",
      retryDelay: 2500,
      onMutate(variables) {
      },
      onError: (error) => {
        throw error;
      }
    },
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      // retryDelay: 2500,
      refetchOnReconnect: false,
      // suspense: true,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data) => {
    },
    onError: (err, mutation, rollback) => {
      console.error("🚀 ~ file: app.tsx:54 ~ err:", err);
      throw err;
    },


  })
});


const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});


// Path: screens/src/app.tsx
// App component is the root component of the application
export const App = () => {
  // AsyncStorage.clear();
  // printAsyncStorage();
  // useAppState(onAppStateChange);

  useOnlineManager();

  // useBackup();

  // AsyncStorage.clear();      
  // QueryClient is used to cache the data fetched from the API

  // SafeAreaProvider is required to render the content of the application in the safe area of the device
  // ThemeProvider is used to set the theme of the application
  // StatusBar is used to set the status bar of the application
  // QueryClientProvider is used to cache the data fetched from the API
  // AuthProvider is used to manage the authentication flow of the application
  // ActionSheetProvider is used to render the action sheet of the application
  // RootStack is used to render the navigation stack of the application
  return (
    <SafeAreaProvider>
      {/* <StoreProvider store={store}> */}
      <ErrorBoundary catchErrors="always">
        <ThemeProvider
          theme={THEME.LIGHT}
          themes={THEMES}
          autoSwitchTheme={false}
        >
          <StatusBar barStyle="dark-content" backgroundColor="rgba(75,92,141, 0.08)" animated />
          <OfflineHeader />
          <PersistQueryClientProvider client={queryClient} persistOptions={{
            maxAge: Infinity,
            persister: asyncPersist
          }} onSuccess={() => {
            // Invalidate all queries after the client has been persisted
            queryClient.resumePausedMutations().then(() => {
              queryClient.invalidateQueries();
            })
          }}
          >
            <AuthProvider>
              <ActionSheetProvider>
                <RootStack />
              </ActionSheetProvider>
            </AuthProvider>
          </PersistQueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
      {/* </StoreProvider> */}
    </SafeAreaProvider>
  );
}
