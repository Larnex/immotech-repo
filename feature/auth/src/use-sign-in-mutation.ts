import { useMutation } from '@immotech-feature/api';

export interface UserLoginRequest {
  username: string;
  password: string;
}

interface User {
  uid: string;
}

export interface UserAccount {
  username: string;
  id: number;
  user: User;
  token: string;
  alreadyLoggedIn?: boolean;
}

export function useSignInMutation() {
  return useMutation<UserAccount, UserLoginRequest>('/api/app/user/login', {
    withAuthHeader: true,
    retry: 1,
    retryDelay: 500,
  });
}

export function useSignOutMutation() {
  return useMutation('/api/app/user/logout.json', {
    withAuthHeader: true,
  });
}
