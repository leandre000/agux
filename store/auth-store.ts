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
  checkAuthStatus: () => Promise<void>;
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

      checkAuthStatus: async () => {
        try {
          const token = await readToken();
          if (token) {
            // Verify token with backend
            const response = await authedApi.get('/api/users/me');
            if (response.status === 200) {
              const user = response.data;
              const mappedUser: User = {
                id: user.user_id,
                email: user.email,
                username: user.name,
              };
              set({ user: mappedUser, isAuthenticated: true, isLoading: false });
            } else {
              // Token invalid, clear it
              await clearToken();
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          // Network error or invalid token
          await clearToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

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
          let errorMessage = "Login failed. Please check your credentials.";
          
          if (error?.response?.status === 401) {
            errorMessage = "Invalid email/phone or password. Please try again.";
          } else if (error?.response?.status === 404) {
            errorMessage = "User not found. Please check your credentials.";
          } else if (error?.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          set({
            error: errorMessage,
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
            password: userData.password!,
            name: userData.username!,
            phone_number: userData.phone_number,
          };

          const data = (
            await authedApi.post<RegisterResponse>("/api/users/register", body)
          ).data;

          if (data.user) {
            // Registration successful, now login
            await get().login({
              identifier: userData.email!,
              password: userData.password!,
            });
          } else {
            set({
              error: data.message || "Registration failed. Please try again.",
              isLoading: false,
            });
            throw new Error(data.message || "Registration failed");
          }
        } catch (error: any) {
          let errorMessage = "Registration failed. Please try again.";
          
          if (error?.response?.status === 409) {
            errorMessage = "User already exists with this email/phone.";
          } else if (error?.response?.status === 400) {
            errorMessage = "Invalid registration data. Please check your information.";
          } else if (error?.response?.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await clearToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          // Even if clearing token fails, reset state
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      verifyAccount: async (code) => {
        set({ isLoading: true, error: null });
        try {
          await authedApi.post("/api/users/verify", { code });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Verification failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authedApi.post("/api/users/forgot-password", { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Password reset failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      updatePassword: async (newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authedApi.post("/api/users/reset-password", { newPassword });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Password update failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "agura-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
