// auth/auth-provider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { AuthContext, AuthState } from "./auth-context";
import { useAutoSignIn } from "./use-auto-sign-in";
import { useErrorHandling } from "./use-error-handling";
import { useSignInMutation, useSignOutMutation } from "./use-sign-in-mutation";
import { useUserQuery } from "./use-user-query";

interface Props {
  children: React.ReactElement;
}

export function AuthProvider({ children }: Props) {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [authState, setAuthState] = useState(AuthState.UNAUTHORIZED);
  const { data: user } = useUserQuery({ userId })

  const { signIn, signOut, loading, error } = useAutoSignIn(
    userId,
    setUserId,
    setAuthState
  );

  const { handleError } = useErrorHandling(authState, setAuthState, error);

  useEffect(() => {
    handleError();
  }, [error]);

  const value = {
    user: user,
    signIn,
    signOut,
    loading,
    error,
    state: authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
