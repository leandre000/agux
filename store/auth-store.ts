import * as AuthAPI from "@/lib/api/auth";
import {
    clearToken,
    getToken as readToken,
    setToken as writeToken,
} from "@/lib/authToken";
import { AuthState, User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RegisterBody = {
  email: string;
  password: string;
  phone_number?: string;
  username?: string;
};

interface AuthStore extends AuthState {
  login: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<void>;
  register: (user: Partial<User> & { password: string }) => Promise<void>;
  loginWithGoogle: (idToken: string, accessToken?: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, verificationCode: string) => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<void>;
  requestPasswordReset: (identifier: string) => Promise<void>;
  verifyResetCode: (identifier: string, code: string) => Promise<void>;
  resetPassword: (identifier: string, code: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
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
            try {
              const response = await AuthAPI.verifyToken();
              if (response.success) {
                const user = response.user;
                const mappedUser: User = {
                  id: user.user_id,
                  email: user.email,
                  username: user.name,
                  phone: user.phone_number,
                };
                set({ user: mappedUser, isAuthenticated: true, isLoading: false });
              } else {
                // Token invalid, clear it
                await clearToken();
                set({ user: null, isAuthenticated: false, isLoading: false });
              }
            } catch (error) {
              // Network error or invalid token
              await clearToken();
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          // Error reading token
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthAPI.login(credentials);
          
          if (response.success && response.token) {
            // Persist token
            await writeToken(response.token);

            const mappedUser: User = {
              id: response.user.user_id,
              email: response.user.email,
              username: response.user.name,
              phone: response.user.phone_number,
            };
            
            set({ user: mappedUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error: any) {
          set({
            error: error.message || "Login failed. Please check your credentials.",
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
            phone_number: userData.phone,
            username: userData.username,
          };

          const response = await AuthAPI.register(body);

          if (response.success && response.user) {
            // Registration successful, now login
            await get().login({
              identifier: userData.email!,
              password: userData.password!,
            });
          } else if (response.requires_verification) {
            // Handle verification requirement
            set({
              error: "Please check your email/phone for verification code",
              isLoading: false,
            });
            throw new Error("Verification required");
          } else {
            set({
              error: response.message || "Registration failed. Please try again.",
              isLoading: false,
            });
            throw new Error(response.message || "Registration failed");
          }
        } catch (error: any) {
          if (error.message !== "Verification required") {
            set({
              error: error.message || "Registration failed. Please try again.",
              isLoading: false,
            });
          }
          throw error;
        }
      },

      loginWithGoogle: async (idToken: string, accessToken?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthAPI.loginWithGoogle({ id_token: idToken, access_token: accessToken });
          
          if (response.success && response.token) {
            // Persist token
            await writeToken(response.token);

            const mappedUser: User = {
              id: response.user.user_id,
              email: response.user.email,
              username: response.user.name,
              phone: response.user.phone_number,
            };
            
            set({ user: mappedUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("Google login failed");
          }
        } catch (error: any) {
          set({
            error: error.message || "Google login failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      loginWithPhone: async (phoneNumber: string, verificationCode: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthAPI.loginWithPhone({ phone_number: phoneNumber, verification_code: verificationCode });
          
          if (response.success && response.token) {
            // Persist token
            await writeToken(response.token);

            const mappedUser: User = {
              id: response.user.user_id,
              email: response.user.email,
              username: response.user.name,
              phone: response.user.phone_number,
            };
            
            set({ user: mappedUser, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error("Phone login failed");
          }
        } catch (error: any) {
          set({
            error: error.message || "Phone login failed. Please try again.",
            isLoading: false,
          });
          throw error;
        }
      },

      sendPhoneVerification: async (phoneNumber: string) => {
        try {
          const response = await AuthAPI.sendPhoneVerification({ phone_number: phoneNumber });
          return response.success;
        } catch (error: any) {
          set({ error: error.message || "Failed to send verification code" });
          throw error;
        }
      },

      requestPasswordReset: async (identifier: string) => {
        try {
          const response = await AuthAPI.requestPasswordReset({ identifier });
          return response.success;
        } catch (error: any) {
          set({ error: error.message || "Failed to request password reset" });
          throw error;
        }
      },

      verifyResetCode: async (identifier: string, code: string) => {
        try {
          const response = await AuthAPI.verifyResetCode({ identifier, verification_code: code });
          return response.success;
        } catch (error: any) {
          set({ error: error.message || "Failed to verify reset code" });
          throw error;
        }
      },

      resetPassword: async (identifier: string, code: string, newPassword: string) => {
        try {
          const response = await AuthAPI.resetPassword({ 
            identifier, 
            verification_code: code, 
            new_password: newPassword 
          });
          return response.success;
        } catch (error: any) {
          set({ error: error.message || "Failed to reset password" });
          throw error;
        }
      },

      logout: async () => {
        try {
          await AuthAPI.logout();
        } catch (error) {
          // Logout should not fail - continue with local cleanup
        } finally {
          // Always clear local state
          await clearToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
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
