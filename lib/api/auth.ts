import { apiPost } from "@/config/api";

export interface LoginRequest {
  identifier: string; // email or phone
  password: string;
}
export interface BackendUser {
  user_id: string;
  email: string;
  name: string;
  role?: string;
  [k: string]: any;
}
export interface LoginResponse {
  message?: string;
  token: string;
  user: BackendUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
}
export interface RegisterResponse {
  message?: string;
  user?: BackendUser;
}

export interface PasswordResetRequestRequest {
  identifier: string; // backend supports email or phone by contract
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

export async function login(body: LoginRequest) {
  // backend expects {identifier, password}
  return apiPost<LoginResponse, LoginRequest>("/api/users/login", body);
}

export async function register(body: RegisterRequest) {
  return apiPost<RegisterResponse, RegisterRequest>(
    "/api/users/register",
    body
  );
}

export async function requestPasswordReset(body: PasswordResetRequestRequest) {
  return apiPost("/api/password-reset/request", body);
}

export async function verifyResetCode(body: PasswordResetVerifyRequest) {
  return apiPost("/api/password-reset/verify", body);
}

export async function resetPassword(body: PasswordResetResetRequest) {
  return apiPost("/api/password-reset/reset", body);
}
