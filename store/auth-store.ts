import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '@/types/auth';


interface AuthStore extends AuthState {
    login: (credentials: { identifier: string; password: string }) => Promise<void>;
    register: (user: Partial<User> & { password: string }) => Promise<void>;
    logout: () => void;
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
                    const { token, user } = await authApi.login(credentials);
                    // Map API user to local User type
                    const mappedUser: User = {
                        id: user.user_id,
                        email: user.email,
                        username: user.name,
                        // Add more fields if needed
                    };
                    set({ user: mappedUser, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Login failed. Please check your credentials.', isLoading: false });
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    await authApi.register({
                        email: userData.email!,
                        password: userData.password,
                        name: userData.username || '',
                        phone_number: userData.phone || '',
                    });
                    set({ isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Registration failed. Please try again.', isLoading: false });
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
                authApi.removeToken && authApi.removeToken();
            },

            updateUser: (userData) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...userData } });
                }
            },

            verifyAccount: async (code) => {
                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    set({ isLoading: false });
                    return Promise.resolve();
                } catch (error) {
                    set({ error: 'Verification failed. Please try again.', isLoading: false });
                    return Promise.reject(error);
                }
            },

            resetPassword: async (email) => {
                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    set({ isLoading: false });
                    return Promise.resolve();
                } catch (error) {
                    set({ error: 'Password reset failed. Please try again.', isLoading: false });
                    return Promise.reject(error);
                }
            },

            updatePassword: async (newPassword) => {
                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    set({ isLoading: false });
                    return Promise.resolve();
                } catch (error) {
                    set({ error: 'Password update failed. Please try again.', isLoading: false });
                    return Promise.reject(error);
                }
            },
        }),
        {
            name: 'agura-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
