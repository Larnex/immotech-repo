import * as ReactQuery from "@tanstack/react-query";
import { HttpMethod } from "./http-method";
import { useFetch } from "./use-fetch";

export type QueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends ReactQuery.QueryKey
> = Omit<
  ReactQuery.UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
> & { method?: HttpMethod; withAuthHeader?: boolean };

export function useQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = Error | null,
  TQueryKey extends ReactQuery.QueryKey = ReactQuery.QueryKey
>(
  url: string,
  key: TQueryKey,
  options?: QueryOptions<TQueryFnData, TError, TData, TQueryKey>
): ReactQuery.UseQueryResult<TData, TError> {
  const queryFn = useFetch("GET", url);
  return ReactQuery.useQuery<TQueryFnData, TError, TData, TQueryKey>(
    key,
    queryFn as any,
    options
  );
}
