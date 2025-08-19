export const PRODUCTION_CONFIG = {
  API_BASE_URL: 'https://agura-ticketing-backend.onrender.com',
  API_TIMEOUT: 30000,
  ENVIRONMENT: 'production',
  FEATURES: {
    ANALYTICS: true,
    ERROR_REPORTING: true,
    PERFORMANCE_MONITORING: true,
    MOBILE_OPTIMIZATION: true,
    OFFLINE_SUPPORT: false,
    PUSH_NOTIFICATIONS: true,
  },
  SECURITY: {
    TOKEN_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 minutes
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    API_RATE_LIMIT: 100, // requests per minute
    REQUEST_TIMEOUT: 30000, // 30 seconds
  },
  CACHE: {
    EVENTS_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    USER_PROFILE_CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
    VENUES_CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
    TICKET_CATEGORIES_CACHE_DURATION: 2 * 60 * 1000, // 2 minutes
  },
  MOBILE: {
    SEAT_SELECTION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
    PURCHASE_TIMEOUT: 10 * 60 * 1000, // 10 minutes
    MAX_SEATS_PER_SELECTION: 10,
    SEAT_HOLD_DURATION: 15, // minutes
    AUTO_REFRESH_INTERVAL: 30 * 1000, // 30 seconds
  },
  PAYMENT: {
    SUPPORTED_METHODS: ['mobile_money', 'card', 'bank_transfer'],
    CURRENCIES: ['RWF', 'USD'],
    DEFAULT_CURRENCY: 'RWF',
    PAYMENT_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  },
  PERFORMANCE: {
    IMAGE_QUALITY: 'medium',
    LAZY_LOADING: true,
    VIRTUAL_SCROLLING: true,
    DEBOUNCE_DELAY: 300, // milliseconds
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
      'X-Platform': 'mobile',
      'X-App-Version': '1.0.0',
    },
  };
};

export const getMobileConfig = () => {
  return {
    seatSelectionTimeout: PRODUCTION_CONFIG.MOBILE.SEAT_SELECTION_TIMEOUT,
    purchaseTimeout: PRODUCTION_CONFIG.MOBILE.PURCHASE_TIMEOUT,
    maxSeatsPerSelection: PRODUCTION_CONFIG.MOBILE.MAX_SEATS_PER_SELECTION,
    seatHoldDuration: PRODUCTION_CONFIG.MOBILE.SEAT_HOLD_DURATION,
    autoRefreshInterval: PRODUCTION_CONFIG.MOBILE.AUTO_REFRESH_INTERVAL,
  };
};

export const getPaymentConfig = () => {
  return {
    supportedMethods: PRODUCTION_CONFIG.PAYMENT.SUPPORTED_METHODS,
    currencies: PRODUCTION_CONFIG.PAYMENT.CURRENCIES,
    defaultCurrency: PRODUCTION_CONFIG.PAYMENT.DEFAULT_CURRENCY,
    paymentTimeout: PRODUCTION_CONFIG.PAYMENT.PAYMENT_TIMEOUT,
  };
}; 