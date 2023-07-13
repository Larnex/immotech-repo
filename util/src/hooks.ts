import { useQueryClient } from '@tanstack/react-query';
import { usePrevious } from '@immotech/util';
import { useIsFocused } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

export function useListHooks() {
  const isFocused = useIsFocused();
  const netInfo = useNetInfo();
  const queryClient = useQueryClient();
  const prevIsFocused = usePrevious(isFocused);

  return { isFocused, netInfo, queryClient, prevIsFocused };
}
