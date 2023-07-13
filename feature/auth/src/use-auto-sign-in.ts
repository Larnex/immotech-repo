import NetInfo from '@react-native-community/netinfo';
// auth/use-auto-sign-in.ts
import React from 'react';
import { setAuthToken } from '@immotech-feature/api/src';
import { useCompare, usePersistedState } from '@immotech/util/src';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { AuthState } from './auth-context';
import { useSignInMutation, useSignOutMutation } from './use-sign-in-mutation';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
const USER_CREDENTIALS_KEY = 'USER_CREDENTIALS_KEY';

export function useAutoSignIn(
  userId: string | undefined,
  setUserId: (userId: string | undefined) => void,
  setAuthState: (state: AuthState) => void,
) {
  const queryCache = useQueryClient();

  const [usernameState, setUsername] = usePersistedState<any>('username');
  const [passwordState, setPassword] = usePersistedState<any>('password');

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isAutoSigningIn, setIsAutoSigningIn] = React.useState(false);

  const hasUsernameStateChanged = useCompare(usernameState);
  const hasPasswordStateChanged = useCompare(passwordState);

  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;

  const { mutateAsync: signOutUser } = useSignOutMutation();
  const { mutateAsync: signInUser, isLoading: loading, error: signInError } = useSignInMutation();

  const signIn = useCallback(
    async (username: string, password: string) => {
      try {
        // if (username && password) {
        //   setUsername(username);
        //   setPassword(password);
        // }
        const response = await signInUser({ username, password });
        
        
        const {
          token,
          user: { uid },
        } = response;

        await AsyncStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify({ username, password }));

        await setAuthToken(token);
        setUserId(uid);
        setAuthState(AuthState.AUTHORIZED);
      } catch (error) {
        throw error;
      }
    },
    [signInUser, setUserId],
  );

  const signOut = useCallback(async () => {
    await signOutUser();

    setAuthState(AuthState.UNAUTHORIZED);

    setUserId(undefined);
    await AsyncStorage.clear();
    
    clearTheCache();
  }, [signOutUser]);

  const clearTheCache = () => {
    try {
      queryCache.clear();
    } catch (error) {
      console.error('Error clearing queryCache:', error);
    }
  };

  // TODO: Add auto login when offline
  // Auto login
  useEffect(() => {
    const autoSignIn = async () => {
      setIsAutoSigningIn(true);

      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        const credentials = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

        if (credentials && token) {
          setAuthState(AuthState.AUTHORIZED);
        }
      } else {
        try {
          const credentials = await AsyncStorage.getItem(USER_CREDENTIALS_KEY);
          if (credentials) {
            const { username, password } = JSON.parse(credentials);
            await signIn(username, password);
          }
        } catch (error) {
          console.error('Auto sign-in failed:', error);
        }
      }
      setIsAutoSigningIn(false);
    };

    autoSignIn();
  }, []);

  // useEffect(() => {
  //   // setAuthState(AuthState.UNAUTHORIZED);

  //   autoSignIn();
  // }, [autoSignIn]);

  // useEffect(() => {
  //   if (isConnected === true) {
  //     autoSignIn();
  //   }
  // }, [isConnected]);

  useEffect(() => {
    if (isConnected === true) {
      setLoggedIn(true);
    }
  }, [isConnected]);

  // useEffect(() => {
  //   if (loading) {
  //     setAuthState(AuthState.PENDING);
  //   } else {

  //   }
  // }, [loading]);

  return { signIn, signOut, loading, error: signInError, isAutoSigningIn };
}
