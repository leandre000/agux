export const SECURITY_CONFIG = {
  // Token security
  TOKEN: {
    STORAGE_KEY: 'agura_auth_token',
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    CLEANUP_INTERVAL: 60 * 1000, // 1 minute
  },

  // API security
  API: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    TIMEOUT: 30000, // 30 seconds
    RATE_LIMIT: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 60 * 1000, // 1 minute
    },
  },

  // CORS and headers
  HEADERS: {
    REQUIRED: ['Authorization', 'Content-Type', 'Accept'],
    BLOCKED: ['X-Forwarded-For', 'X-Real-IP'],
    CUSTOM: {
      'X-App-Version': '1.0.0',
      'X-Platform': 'mobile',
      'X-Client': 'agura-mobile',
    },
  },

  // Input validation
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_SPECIAL: false,
      MAX_ATTEMPTS: 5,
      LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    },
    EMAIL: {
      MAX_LENGTH: 254,
      ALLOWED_DOMAINS: [], // Empty means all domains allowed
    },
    PHONE: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 15,
      ALLOWED_COUNTRIES: ['+1', '+44', '+33', '+49', '+81', '+86', '+91'], // Add more as needed
    },
  },

  // Session security
  SESSION: {
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_CONCURRENT_SESSIONS: 3,
    FORCE_LOGOUT_ON_PASSWORD_CHANGE: true,
    LOGOUT_ON_APP_BACKGROUND: false,
  },

  // Biometric authentication
  BIOMETRIC: {
    ENABLED: true,
    FALLBACK_TO_PIN: true,
    PIN_LENGTH: 6,
    MAX_PIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 5 * 60 * 1000, // 5 minutes
  },

  // Network security
  NETWORK: {
    ALLOWED_PROTOCOLS: ['https:'],
    BLOCKED_DOMAINS: [],
    CERTIFICATE_PINNING: true,
    ALLOW_INSECURE_LOCALHOST: false,
  },

  // Data encryption
  ENCRYPTION: {
    STORAGE_ENCRYPTION: true,
    NETWORK_ENCRYPTION: true,
    KEY_ROTATION_INTERVAL: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Audit logging
  AUDIT: {
    ENABLED: true,
    LOG_LEVELS: ['ERROR', 'WARN', 'INFO', 'SECURITY'],
    MAX_LOG_ENTRIES: 1000,
    RETENTION_PERIOD: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
} as const;

// Security utility functions
export const SecurityUtils = {
  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.VALIDATION.PASSWORD;

    if (password.length < config.MIN_LENGTH) {
      errors.push(`Password must be at least ${config.MIN_LENGTH} characters long`);
    }

    if (config.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate email format and domain
  validateEmail: (email: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.VALIDATION.EMAIL;

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    if (email.length > config.MAX_LENGTH) {
      errors.push(`Email must be less than ${config.MAX_LENGTH} characters`);
    }

    // Domain validation (if configured)
    if (config.ALLOWED_DOMAINS.length > 0) {
      const domain = email.split('@')[1];
      if (!config.ALLOWED_DOMAINS.includes(domain)) {
        errors.push('Email domain not allowed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate phone number
  validatePhone: (phone: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.VALIDATION.PHONE;

    // Remove all non-digit characters for length check
    const digitsOnly = phone.replace(/\D/g, '');

    if (digitsOnly.length < config.MIN_LENGTH || digitsOnly.length > config.MAX_LENGTH) {
      errors.push(`Phone number must be between ${config.MIN_LENGTH} and ${config.MAX_LENGTH} digits`);
    }

    // Country code validation
    if (config.ALLOWED_COUNTRIES.length > 0) {
      const hasValidCountryCode = config.ALLOWED_COUNTRIES.some(code => 
        phone.startsWith(code)
      );
      if (!hasValidCountryCode) {
        errors.push('Phone number must start with a valid country code');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Check if URL is secure
  isSecureUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return SECURITY_CONFIG.NETWORK.ALLOWED_PROTOCOLS.includes(urlObj.protocol);
    } catch {
      return false;
    }
  },
};
