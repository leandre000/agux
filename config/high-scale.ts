// High-Scale Production Configuration for Millions of Users

export const HIGH_SCALE_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: 'https://agura-ticketing-backend.onrender.com',
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    RATE_LIMIT: {
      REQUESTS_PER_MINUTE: 1000,
      BURST_LIMIT: 100,
    },
    LOAD_BALANCING: {
      ENABLED: true,
      HEALTH_CHECK_INTERVAL: 30000,
      FAILOVER_ENABLED: true,
    },
  },

  // Database Configuration
  DATABASE: {
    CONNECTION_POOL: {
      MIN: 10,
      MAX: 100,
      ACQUIRE_TIMEOUT: 60000,
      IDLE_TIMEOUT: 300000,
    },
    QUERY_OPTIMIZATION: {
      ENABLE_QUERY_CACHE: true,
      CACHE_TTL: 300000, // 5 minutes
      MAX_QUERY_TIME: 10000,
    },
    READ_REPLICAS: {
      ENABLED: true,
      COUNT: 3,
      LOAD_BALANCING: 'round-robin',
    },
  },

  // Caching Strategy
  CACHE: {
    REDIS: {
      ENABLED: true,
      CLUSTER_MODE: true,
      NODES: [
        'redis-cluster-1:6379',
        'redis-cluster-2:6379',
        'redis-cluster-3:6379',
      ],
      TTL: {
        EVENTS: 300000, // 5 minutes
        USER_PROFILE: 600000, // 10 minutes
        TICKETS: 180000, // 3 minutes
        SEARCH_RESULTS: 120000, // 2 minutes
      },
    },
    MEMORY: {
      ENABLED: true,
      MAX_SIZE: 100 * 1024 * 1024, // 100MB
      TTL: 60000, // 1 minute
    },
  },

  // CDN Configuration
  CDN: {
    ENABLED: true,
    PROVIDER: 'cloudflare',
    DOMAINS: [
      'cdn1.agura.com',
      'cdn2.agura.com',
      'cdn3.agura.com',
    ],
    CACHE_HEADERS: {
      IMAGES: 'public, max-age=31536000', // 1 year
      CSS_JS: 'public, max-age=86400', // 1 day
      API_RESPONSES: 'public, max-age=300', // 5 minutes
    },
  },

  // Performance Monitoring
  MONITORING: {
    APM: {
      ENABLED: true,
      PROVIDER: 'datadog',
      SAMPLE_RATE: 0.1, // 10% of requests
      SLOW_QUERY_THRESHOLD: 1000, // 1 second
    },
    METRICS: {
      ENABLED: true,
      COLLECTION_INTERVAL: 10000, // 10 seconds
      RETENTION_PERIOD: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    ALERTING: {
      ENABLED: true,
      RESPONSE_TIME_THRESHOLD: 2000, // 2 seconds
      ERROR_RATE_THRESHOLD: 0.05, // 5%
      CPU_THRESHOLD: 0.8, // 80%
      MEMORY_THRESHOLD: 0.85, // 85%
    },
  },

  // Security & Rate Limiting
  SECURITY: {
    RATE_LIMITING: {
      ENABLED: true,
      WINDOW_MS: 60000, // 1 minute
      MAX_REQUESTS: 100,
      BLOCK_DURATION: 300000, // 5 minutes
    },
    DDoS_PROTECTION: {
      ENABLED: true,
      PROVIDER: 'cloudflare',
      CHALLENGE_THRESHOLD: 1000, // requests per second
    },
    API_KEY_ROTATION: {
      ENABLED: true,
      ROTATION_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // Queue Management
  QUEUE: {
    ENABLED: true,
    PROVIDER: 'bull',
    REDIS_URL: 'redis://redis-cluster:6379',
    WORKERS: {
      EMAIL: 10,
      SMS: 5,
      PUSH_NOTIFICATIONS: 8,
      PAYMENT_PROCESSING: 15,
      TICKET_GENERATION: 20,
    },
    PRIORITY_LEVELS: {
      CRITICAL: 1,
      HIGH: 2,
      NORMAL: 3,
      LOW: 4,
    },
  },

  // Search Optimization
  SEARCH: {
    ENABLED: true,
    PROVIDER: 'elasticsearch',
    CLUSTER: {
      NODES: 3,
      SHARDS: 5,
      REPLICAS: 1,
    },
    INDEXING: {
      BATCH_SIZE: 1000,
      REFRESH_INTERVAL: '1s',
      AUTO_REFRESH: true,
    },
    QUERY_OPTIMIZATION: {
      MAX_RESULTS: 1000,
      TIMEOUT: 5000,
      CACHE_ENABLED: true,
    },
  },

  // Image Optimization
  IMAGE_OPTIMIZATION: {
    ENABLED: true,
    PROVIDER: 'sharp',
    FORMATS: ['webp', 'avif', 'jpeg'],
    QUALITY: {
      WEBP: 80,
      AVIF: 75,
      JPEG: 85,
    },
    SIZES: [
      { width: 320, height: 240, suffix: 'sm' },
      { width: 640, height: 480, suffix: 'md' },
      { width: 1280, height: 960, suffix: 'lg' },
      { width: 1920, height: 1440, suffix: 'xl' },
    ],
    COMPRESSION: {
      ENABLED: true,
      ALGORITHM: 'mozjpeg',
      OPTIMIZATION_LEVEL: 3,
    },
  },

  // Analytics & Tracking
  ANALYTICS: {
    ENABLED: true,
    PROVIDER: 'mixpanel',
    TRACKING: {
      PAGE_VIEWS: true,
      USER_ACTIONS: true,
      PERFORMANCE_METRICS: true,
      ERROR_TRACKING: true,
    },
    PRIVACY: {
      GDPR_COMPLIANT: true,
      ANONYMIZE_IP: true,
      RESPECT_DNT: true,
    },
  },

  // Backup & Recovery
  BACKUP: {
    ENABLED: true,
    STRATEGY: 'incremental',
    FREQUENCY: {
      FULL: 'weekly',
      INCREMENTAL: 'daily',
      TRANSACTION_LOG: 'hourly',
    },
    RETENTION: {
      FULL_BACKUPS: 4, // weeks
      INCREMENTAL_BACKUPS: 30, // days
      TRANSACTION_LOGS: 7, // days
    },
    STORAGE: {
      PROVIDER: 'aws-s3',
      REGION: 'us-east-1',
      ENCRYPTION: true,
    },
  },
} as const;

// Environment-specific overrides
export const getHighScaleConfig = (environment: 'staging' | 'production') => {
  const baseConfig = HIGH_SCALE_CONFIG;
  
  if (environment === 'staging') {
    return {
      ...baseConfig,
      API: {
        ...baseConfig.API,
        TIMEOUT: 60000, // Longer timeout for staging
        RATE_LIMIT: {
          ...baseConfig.API.RATE_LIMIT,
          REQUESTS_PER_MINUTE: 100, // Lower limits for staging
        },
      },
      MONITORING: {
        ...baseConfig.MONITORING,
        APM: {
          ...baseConfig.MONITORING.APM,
          SAMPLE_RATE: 1.0, // 100% sampling for staging
        },
      },
    };
  }
  
  return baseConfig;
};
