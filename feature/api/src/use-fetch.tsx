import config from "@immotech-feature/config";
import { fetch as SSLFetch } from "react-native-ssl-pinning";
import { getAuthToken } from "./auth-token";
import { HttpMethod } from "./http-method";
import AsyncStorage from "@react-native-community/async-storage"

const { baseUrl } = config.api;

export interface FetchOptions {
  withAuthHeader?: boolean;
}



export function useFetch<TVariables>(
  method: HttpMethod,
  url: string,
  { withAuthHeader = true }: FetchOptions = {}
) {
  return async (variables?: TVariables) => {
    try {


      if (!url || url.includes('undefined')) {

        return null;
      }

      const response = await SSLFetch(`${baseUrl}${url}`, {
        method: method,
        headers: {
          ...(withAuthHeader
            ? {
              "X-CSRF-Token": await getAuthToken().then((res) => {
                return res;

              }),
            }
            : {}),
          "Content-Type": "application/json",
        },

        ...(method !== "GET"
          ? { body: variables ? JSON.stringify(variables) : "" }
          : {}),

        sslPinning: {
          certs: ["mycert"],
        },
      })

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log("🚀 ~ file: use-fetch.tsx:57 ~ return ~ jsonResponse:", jsonResponse);


      return jsonResponse;
      // }


    } catch (error) {
      // if (error?.status === 406) {
      //   
      //   await AsyncStorage.setItem('alreadyLoggedIn', 'true')
      //   return { alreadyLoggedIn: true };
      // } else {
      throw error;
      // }


    };
  }
}
