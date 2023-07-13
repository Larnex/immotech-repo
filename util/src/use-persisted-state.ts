import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export function usePersistedState<T>(
  key: string,
  initialValue?: T,
): [T, (value: T | undefined) => void, () => void] {
  const [state, setStateValue] = React.useState<T>(initialValue as T);

  const refreshState = React.useCallback(async () => {
    const value = await AsyncStorage.getItem(key);
    setStateValue(value ? JSON.parse(value) : undefined);
  }, [key]);

  const setState = React.useCallback(
    (value: T) => {
      if (value === undefined || value === null) {
        AsyncStorage.removeItem(key);
        setStateValue(value);
      } else {
        AsyncStorage.setItem(key, JSON.stringify(value));
        setStateValue(value);
      }
    },
    [setStateValue, key],
  );

  React.useEffect(() => {
    refreshState();
  }, [refreshState]);

  return [state, setState as any, refreshState];
}
