import * as ReactQuery from "@tanstack/react-query";
import { HttpMethod } from "./http-method";
import { useFetch } from "./use-fetch";

export type MutationOptions<TData, TError, TVariables, TContext> = Omit<
    ReactQuery.UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
> & { method?: HttpMethod; withAuthHeader?: boolean };

export function useDelete<
    TData = unknown,
    TError = Error | null,
    TVariables = void,
    TContext = unknown
>(
    mutationFn: (variables: TVariables) => { url: string; method: HttpMethod },
    options?: MutationOptions<TData, TError, TVariables, TContext>
): ReactQuery.UseMutationResult<TData, TError, TVariables, TContext> {
    const fetchFn = (variables: TVariables) => {
        const { url, method } = mutationFn(variables);
        return useFetch(method, url, {
            withAuthHeader: options?.withAuthHeader,
        })(variables);
    };

    return ReactQuery.useMutation<TData, TError, TVariables, TContext>(
        fetchFn as any,
        options
    );
}

