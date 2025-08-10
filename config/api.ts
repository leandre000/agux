import { clearToken } from "@/lib/authToken";
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
    },
    // Production timeout - increased for render.com
    timeout: PRODUCTION_CONFIG.API_TIMEOUT,
  });

  // Request: inject token
  instance.interceptors.request.use(async (config: any) => {
    const tokenMaybePromise = options?.getToken?.();
    const token =
      tokenMaybePromise && typeof (tokenMaybePromise as any).then === "function"
        ? await (tokenMaybePromise as Promise<string | null>)
        : (tokenMaybePromise as string | null);

    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
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
        // Clear token and optionally route to login
        try {
          await clearToken();
        } catch {}
        try {
          await options?.onUnauthorized?.();
        } catch {}
        // Optionally, navigate using deep link to login
        try {
          const url = Linking.createURL("/auth/login");
          // Fire-and-forget; it's okay if it fails in background
          Linking.openURL(url).catch(() => {});
        } catch {}
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
