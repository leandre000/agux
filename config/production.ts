export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://agura-ticketing-backend.onrender.com',
  API_TIMEOUT: 30000,
  ENVIRONMENT: 'production',
  FEATURES: {
    ANALYTICS: true,
    ERROR_REPORTING: true,
    PERFORMANCE_MONITORING: true,
  },
  SECURITY: {
    TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  },
  CACHE: {
    EVENTS_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    USER_PROFILE_CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
  },
} as const;

export const getApiConfig = () => {
  return {
    baseURL: PRODUCTION_CONFIG.API_BASE_URL,
    timeout: PRODUCTION_CONFIG.API_TIMEOUT,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Agura-Mobile/1.0.0',
    },
  };
}; 