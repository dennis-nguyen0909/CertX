"use client";
import { useStorageState } from "@/hooks/use-storage-state";
import { useContext, createContext, type PropsWithChildren } from "react";
import { store } from "@/store";
import { clearUserData } from "@/store/slices/user-slice";
import { useLogoutMutation } from "@/hooks/auth/use-logout-mutation";

const AuthContext = createContext<{
  signIn: (accessToken: string, refreshToken: string, role: string) => void;
  signOut: () => void;
  accessToken?: string | null;
  refreshToken?: string | null;
  role?: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  accessToken: null,
  refreshToken: null,
  role: null,
  isLoading: false,
  isAuthenticated: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoadingAccessToken, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isLoadingRefreshToken, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [[isLoadingRole, role], setRole] = useStorageState("role");

  const { mutate: logout } = useLogoutMutation();

  return (
    <AuthContext.Provider
      value={{
        signIn: (accessToken: string, refreshToken: string, role: string) => {
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setRole(role);
        },
        signOut: () => {
          logout(undefined, {
            onSuccess: (response) => {
              console.log("Logout success:", response);
              setAccessToken(null);
              setRefreshToken(null);
              setRole(null);
              store.dispatch(clearUserData());
            },
            onError: (error) => {
              console.error("Logout error:", error);
              setAccessToken(null);
              setRefreshToken(null);
              setRole(null);
              store.dispatch(clearUserData());
            },
          });
        },
        accessToken,
        refreshToken,
        role,
        isLoading:
          isLoadingAccessToken || isLoadingRefreshToken || isLoadingRole,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
