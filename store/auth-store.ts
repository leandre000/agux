import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthState } from "@/types/auth";
import { createApiClient } from "@/config/api";
import {
  getToken as readToken,
  setToken as writeToken,
  clearToken,
} from "@/lib/authToken";

const authedApi = createApiClient({
  getToken: async () => await readToken(),
});

type RegisterBody = {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
};

interface BackendUser {
  user_id: string;
  email: string;
  name: string;
  role?: string;
  [k: string]: any;
}
interface LoginResponse {
  token: string;
  user: BackendUser;
}
interface RegisterResponse {
  message?: string;
  user?: BackendUser;
}

interface AuthStore extends AuthState {
  login: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<void>;
  register: (user: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  verifyAccount: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Backend expects { identifier, password }
          const body = {
            identifier: credentials.identifier,
            password: credentials.password,
          };
          const data = (
            await authedApi.post<LoginResponse>("/api/users/login", body)
          ).data;

          const { token, user } = data;

          // persist token
          await writeToken(token);

          const mappedUser: User = {
            id: user.user_id,
            email: user.email,
            username: user.name,
          };
          set({ user: mappedUser, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error:
              error?.message || "Login failed. Please check your credentials.",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const body: RegisterBody = {
            email: userData.email!,
            password: userData.password,
            name: userData.username || "",
            phone_number: (userData as any).phone || "",
          };
          await authedApi.post<RegisterResponse>("/api/users/register", body);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Registration failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        await clearToken();
        set({ user: null, isAuthenticated: false });
      },

      logoutWithConfirmation: async () => {
        return new Promise((resolve) => {
          // This will be handled by the component calling this function
          resolve(true);
        });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      verifyAccount: async (_code) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise((resolve) => setTimeout(resolve, 300));
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: "Verification failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      // Request password reset code (backend expects identifier: email or phone)
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authedApi.post("/api/password-reset/request", {
            identifier: email,
          });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Password reset failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      // Complete password reset with verification_code + new password
      updatePassword: async (newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const identifier = (get() as any).resetIdentifier as
            | string
            | undefined;
          const verification_code = (get() as any).resetCode as
            | string
            | undefined;

          await authedApi.post("/api/password-reset/reset", {
            identifier,
            verification_code,
            new_password: newPassword,
          });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error:
              error?.message || "Password update failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "agura-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // keep reset flow context if present to complete without re-entry
        resetIdentifier: (state as any).resetIdentifier,
        resetCode: (state as any).resetCode,
      }),
    }
  )
);
