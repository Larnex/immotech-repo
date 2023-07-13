import config from '@immotech-feature/config/src';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { fetch } from 'react-native-ssl-pinning';

const { baseUrl } = config.api;

export interface Token {
  token: string;
}

export async function setUserCredentials(username?: string, password?: string) {
  if (username && password) {
    const userData = {
      username,
      password,
    };

    return await AsyncStorage.setItem('USER_CREDENTIALS', JSON.stringify(userData));
  }
}

export async function getUserCredentials() {
  return await AsyncStorage.getItem('USER_CREDENTIALS');
}

let authToken: any = null;

let isFetchingToken = false;
let fetchTokenPromise: any = null;

export async function getAuthToken() {
  if (authToken !== null) {
    return authToken;
  }

  if (isFetchingToken) {
    // Wait for the current fetch to complete and return its result
    return await fetchTokenPromise;
  }

  isFetchingToken = true;
  fetchTokenPromise = (async () => {
    try {
      const storedToken = await AsyncStorage.getItem('AUTH_TOKEN_KEY');

      if (storedToken === '' || storedToken === null) {
        await setAuthToken();
        authToken = (await AsyncStorage.getItem('AUTH_TOKEN_KEY')) ?? '';
      } else {
        authToken = storedToken;
      }

      return authToken;
    } finally {
      isFetchingToken = false;
    }
  })();

  return await fetchTokenPromise;
}

export async function setAuthToken(token?: string) {
  // const tokenItem = await AsyncStorage.getItem('AUTH_TOKEN_KEY');
  try {
    if (token) {
      authToken = token;
      return await AsyncStorage.setItem('AUTH_TOKEN_KEY', token);
    }
    const response = await fetch(`${baseUrl}/api/app/user/token.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const parsedResponse = await response.json();
    authToken = parsedResponse.token as string;
    return await AsyncStorage.setItem('AUTH_TOKEN_KEY', authToken);
  } catch (error) {
    console.error('error with getting auth token', error);

    return;
  }
}

export async function clearAuthToken() {
  authToken = null;
  return await AsyncStorage.removeItem('AUTH_TOKEN_KEY');
}
