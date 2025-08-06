export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  gender?: string;
  profileImage?: string;
  categories?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}