import React from 'react';
import { User } from './use-user-query';

export enum AuthState {
  AUTHORIZED = 'AUTHORIZED',
  PENDING = 'PENDING',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
}

export interface AuthContextType {
  user?: User;
  // getTokenCSRF: () => string;
  signIn: (username: string, password: string) => void;
  signOut?: () => void;
  loading?: boolean;
  error?: Error | null;
  state?: AuthState;
}

export const AuthContext = React.createContext<AuthContextType>({} as any);
