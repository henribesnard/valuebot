"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, ApiError } from "./api";

interface AuthUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  plan: string;
  role?: "user" | "admin";
  is_email_verified: boolean;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, totpCode?: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    acceptAge: boolean
  ) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function storeTokens(res: TokenResponse) {
  localStorage.setItem("vb_access_token", res.access_token);
  localStorage.setItem("vb_refresh_token", res.refresh_token);
}

function clearTokens() {
  localStorage.removeItem("vb_access_token");
  localStorage.removeItem("vb_refresh_token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("vb_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiFetch<{
      id: string;
      email: string;
      first_name: string | null;
      last_name: string | null;
      plan: string;
      role?: "user" | "admin";
      is_email_verified: boolean;
    }>("/api/account", { token })
      .then((profile) => {
        setUser({
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          plan: profile.plan,
          role: profile.role,
          is_email_verified: profile.is_email_verified,
        });
      })
      .catch(async () => {
        // Try refresh
        const refreshToken = localStorage.getItem("vb_refresh_token");
        if (!refreshToken) {
          clearTokens();
          return;
        }
        try {
          const res = await apiFetch<TokenResponse>("/api/auth/refresh", {
            method: "POST",
            body: { refresh_token: refreshToken },
          });
          storeTokens(res);
          setUser(res.user);
        } catch {
          clearTokens();
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string, totpCode?: string) => {
      const res = await apiFetch<TokenResponse>("/api/auth/login", {
        method: "POST",
        body: { email, password, totp_code: totpCode || null },
      });
      storeTokens(res);
      setUser(res.user);
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      acceptAge: boolean
    ) => {
      const res = await apiFetch<TokenResponse>("/api/auth/register", {
        method: "POST",
        body: {
          email,
          password,
          first_name: firstName,
          accept_age: acceptAge,
        },
      });
      storeTokens(res);
      setUser(res.user);
    },
    []
  );

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await apiFetch<TokenResponse>("/api/auth/google", {
      method: "POST",
      body: { credential },
    });
    storeTokens(res);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
