import AsyncStorage from '@react-native-async-storage/async-storage';
// auth/use-error-handling.ts
import { useCallback } from 'react';
import { AuthState } from './auth-context';

export function useErrorHandling(
  authState: AuthState,
  setAuthState: (state: AuthState) => void,
  error: any,
) {
  const handleError = useCallback(async () => {
    if (error) {
      setAuthState(AuthState.ERROR);
      await AsyncStorage.clear();
      throw error;
    } else if (authState === AuthState.ERROR) {
      setAuthState(AuthState.UNAUTHORIZED);
    }
  }, [authState, setAuthState, error]);

  return { handleError };
}
