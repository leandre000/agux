import { apiPost } from "@/config/api";

// Login interfaces
export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: BackendUser;
  expires_at?: string;
}

// Register interfaces
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
  agree_to_terms?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: BackendUser;
  token?: string;
  requires_verification?: boolean;
}

// Social login interfaces
export interface GoogleLoginRequest {
  id_token: string;
  access_token?: string;
}

export interface PhoneLoginRequest {
  phone_number: string;
  verification_code: string;
}

export interface PhoneVerificationRequest {
  phone_number: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message?: string;
  expires_in?: number;
}

// User interface
export interface BackendUser {
  user_id: string;
  email: string;
  name: string;
  phone_number?: string;
  role?: string;
  is_verified?: boolean;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
  [k: string]: any;
}

// Password reset interfaces
export interface PasswordResetRequestRequest {
  identifier: string; // email or phone
}

export interface PasswordResetVerifyRequest {
  identifier: string;
  verification_code: string;
}

export interface PasswordResetResetRequest {
  identifier: string;
  verification_code: string;
  new_password: string;
}

// Authentication functions
export async function login(body: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse, LoginRequest>("/api/auth/login", body);
    return response.data;
  } catch (error: any) {
    // Handle specific login errors
    if (error.status === 401) {
      throw new Error("Invalid email/phone or password");
    } else if (error.status === 422) {
      throw new Error("Please check your input and try again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await apiPost<RegisterResponse, RegisterRequest>("/api/auth/register", body);
    return response.data;
  } catch (error: any) {
    // Handle specific registration errors
    if (error.status === 409) {
      throw new Error("Email or phone number already exists");
    } else if (error.status === 422) {
      throw new Error("Please check your input and try again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Social login functions
export async function loginWithGoogle(body: GoogleLoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse, GoogleLoginRequest>("/api/auth/google", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Google login failed - Please try again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function loginWithPhone(body: PhoneLoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiPost<LoginResponse, PhoneLoginRequest>("/api/auth/phone", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Invalid verification code");
    } else if (error.status === 422) {
      throw new Error("Please check your input and try again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function sendPhoneVerification(body: PhoneVerificationRequest): Promise<PhoneVerificationResponse> {
  try {
    const response = await apiPost<PhoneVerificationResponse, PhoneVerificationRequest>("/api/auth/phone/verify", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 429) {
      throw new Error("Too many attempts - Please wait before trying again");
    } else if (error.status === 422) {
      throw new Error("Invalid phone number format");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Password reset functions
export async function requestPasswordReset(body: PasswordResetRequestRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPost("/api/auth/password-reset/request", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Email or phone number not found");
    } else if (error.status === 429) {
      throw new Error("Too many attempts - Please wait before trying again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function verifyResetCode(body: PasswordResetVerifyRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPost("/api/auth/password-reset/verify", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Invalid verification code");
    } else if (error.status === 422) {
      throw new Error("Please check your input and try again");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function resetPassword(body: PasswordResetResetRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPost("/api/auth/password-reset/reset", body);
    return response.data;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error("Invalid verification code");
    } else if (error.status === 422) {
      throw new Error("Password must be at least 8 characters long");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Logout function
export async function logout(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPost("/api/auth/logout", {});
    return response.data;
  } catch (error: any) {
    // Logout should not fail - return success even if API call fails
    return { success: true, message: "Logged out successfully" };
  }
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's a valid phone number (7-15 digits)
  return cleanPhone.length >= 7 && cleanPhone.length <= 15;
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
