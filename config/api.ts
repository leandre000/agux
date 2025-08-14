import { clearToken, getToken } from "@/lib/authToken";
import { AppError } from "@/lib/errorHandler";
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    isAxiosError,
} from "axios";
import * as Linking from "expo-linking";
import { PRODUCTION_CONFIG } from "./production";

const RUNTIME_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  PRODUCTION_CONFIG.API_BASE_URL;

export const API_BASE_URL = RUNTIME_BASE;

export interface ApiClientOptions {
  getToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => Promise<void> | void;
}

export interface ApiErrorShape {
  message?: string;
  error?: string;
  success?: boolean;
  [key: string]: any;
}

function normalizeError(error: unknown): Error {
  if (isAxiosError(error)) {
    const axErr = error as AxiosError<ApiErrorShape>;
    const status = axErr.response?.status;
    const data = axErr.response?.data;
    
    // Check for network errors
    if (axErr.code === 'NETWORK_ERROR' || !axErr.response) {
      const networkError = new Error('Network Error - Unable to connect to server');
      // @ts-expect-error attach extras for callers if needed
      networkError.code = 'NETWORK_ERROR';
      return networkError;
    }
    
    // Check for timeout errors
    if (axErr.code === 'ECONNABORTED') {
      const timeoutError = new Error('Request timeout - Server took too long to respond');
      // @ts-expect-error attach extras for callers if needed
      timeoutError.code = 'TIMEOUT_ERROR';
      return timeoutError;
    }
    
    // Check for server errors
    if (status && status >= 500) {
      const serverError = new Error('Server error - Please try again later');
      // @ts-expect-error attach extras for callers if needed
      serverError.code = 'SERVER_ERROR';
      serverError.status = status;
      return serverError;
    }
    
    const msg =
      (data && (data.message || data.error)) ||
      axErr.message ||
      (status ? `Request failed with status ${status}` : "Network error");
    const e = new Error(msg);
    // @ts-expect-error attach extras for callers if needed
    e.status = status;
    // @ts-expect-error attach extras for callers if needed
    e.data = data;
    return e;
  }
  return error instanceof Error ? error : new Error("Unknown error");
}

export function createApiClient(options?: ApiClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Agura-Mobile/1.0.0",
    },
    // Production timeout - increased for render.com
    timeout: PRODUCTION_CONFIG.API_TIMEOUT,
  });

  // Request: inject token
  instance.interceptors.request.use(async (config: any) => {
    try {
      const token = await getToken();
      
      if (token) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get token for request:', error);
    }
    
    return config;
  });

  // Response: normalize errors and handle 401
  instance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const err = normalizeError(error) as Error & { status?: number; code?: string };
      
      // Convert to AppError for better handling
      const appError = new AppError(err.message, err.status);
      
      // Handle specific error cases for production
      if (appError.status === 401) {
        // Clear token and redirect to login
        try {
          await clearToken();
        } catch (clearError) {
          console.warn('Failed to clear token:', clearError);
        }
        
        try {
          await options?.onUnauthorized?.();
        } catch (unauthError) {
          console.warn('Failed to handle unauthorized:', unauthError);
        }
        
        // Navigate to login using deep link
        try {
          const url = Linking.createURL("/auth/login");
          Linking.openURL(url).catch(() => {});
        } catch (linkError) {
          console.warn('Failed to navigate to login:', linkError);
        }
      } else if (appError.status === 404) {
        // Handle 404 errors gracefully
        console.warn('API endpoint not found:', error.config?.url);
      } else if (appError.status && appError.status >= 500) {
        // Log server errors for monitoring
        console.error('Server error:', {
          status: appError.status,
          url: error.config?.url,
          message: appError.message
        });
      }
      
      // Re-throw the error for component-level handling
      throw appError;
    }
  );

  return instance;
}

// Helper functions for common HTTP methods
export async function apiGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ data: T; status: number }> {
  const response = await createApiClient().get<T>(url, config);
  return { data: response.data, status: response.status };
}

export async function apiPost<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<{ data: T; status: number }> {
  const response = await createApiClient().post<T>(url, body, config);
  return { data: response.data, status: response.status };
}

export async function apiPut<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<{ data: T; status: number }> {
  const response = await createApiClient().put<T>(url, body, config);
  return { data: response.data, status: response.status };
}

export async function apiPatch<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<{ data: T; status: number }> {
  const response = await createApiClient().patch<T>(url, body, config);
  return { data: response.data, status: response.status };
}

export async function apiDelete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ data: T; status: number }> {
  const response = await createApiClient().delete<T>(url, config);
  return { data: response.data, status: response.status };
}
