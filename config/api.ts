import { clearToken, getToken as readToken } from "@/lib/authToken";
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
      const err = normalizeError(error) as Error & { status?: number };
      
      // Handle specific error cases for production
      if (err?.status === 401) {
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
      } else if (err?.status === 503 || err?.status === 502) {
        // Handle backend maintenance or temporary issues
        console.warn('Backend temporarily unavailable:', err.message);
      } else if (err?.status && err.status >= 500) {
        // Handle server errors
        console.error('Server error:', err.message);
      }
      
      throw err;
    }
  );

  return instance;
}

// Default API without auth injection. Prefer creating authed client where needed.
export const api = createApiClient({
  getToken: async () => await readToken(),
});

export async function apiGet<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) {
  const res = await api.get<T>(url, config);
  return (res as any).data ?? res.data;
}
export async function apiPost<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.post<T>(url, body, config);
  return (res as any).data ?? res.data;
}
export async function apiPut<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.put<T>(url, body, config);
  return (res as any).data ?? res.data;
}
export async function apiPatch<T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
) {
  const res = await api.patch<T>(url, body, config);
  return (res as any).data ?? res.data;
}
export async function apiDelete<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) {
  const res = await api.delete<T>(url, config);
  return (res as any).data ?? res.data;
}
