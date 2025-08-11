export const IOS_CONFIG = {
  // iOS specific configurations
  VERSION: {
    MIN_IOS_VERSION: '13.0',
    TARGET_IOS_VERSION: '17.0',
    SUPPORTED_DEVICES: ['iPhone', 'iPad'],
  },

  // App permissions and capabilities
  PERMISSIONS: {
    CAMERA: {
      PURPOSE: 'Take photos for profile pictures and event documentation',
      REQUIRED: false,
    },
    PHOTO_LIBRARY: {
      PURPOSE: 'Select images for profile pictures',
      REQUIRED: false,
    },
    LOCATION: {
      PURPOSE: 'Find nearby events and provide location-based services',
      REQUIRED: false,
      ACCURACY: 'reduced', // 'full' | 'reduced'
    },
    NOTIFICATIONS: {
      PURPOSE: 'Receive event updates and important notifications',
      REQUIRED: false,
      TYPES: ['alert', 'badge', 'sound'],
    },
    MICROPHONE: {
      PURPOSE: 'Voice notes and audio features',
      REQUIRED: false,
    },
    BIOMETRIC: {
      PURPOSE: 'Secure authentication using Face ID or Touch ID',
      REQUIRED: false,
      FALLBACK: 'PIN',
    },
  },

  // Security features
  SECURITY: {
    KEYCHAIN_ACCESS: true,
    BIOMETRIC_AUTH: true,
    APP_TRANSPORT_SECURITY: {
      ALLOWS_ARBITRARY_LOADS: false,
      ALLOWS_LOCAL_NETWORKING: false,
      REQUIRES_FORWARD_SECRECY: true,
      EXCEPTION_DOMAINS: {
        'localhost': {
          NSExceptionAllowsInsecureHTTPLoads: false,
          NSExceptionMinimumTLSVersion: 'TLSv1.2',
        },
      },
    },
    CODE_SIGNING: {
      REQUIRE_HARDENED_RUNTIME: true,
      REQUIRE_ENTITLEMENTS: true,
    },
  },

  // UI/UX configurations
  UI: {
    SUPPORTED_ORIENTATIONS: ['portrait', 'landscape'],
    SUPPORTED_INTERFACES: ['iphone', 'ipad'],
    STATUS_BAR_STYLE: 'light-content',
    NAVIGATION_BAR_STYLE: 'black',
    TAB_BAR_STYLE: 'default',
    SAFE_AREA_INSETS: true,
    EDGE_TO_EDGE: true,
  },

  // Performance optimizations
  PERFORMANCE: {
    ENABLE_HERMES: true,
    ENABLE_NEW_ARCHITECTURE: true,
    ENABLE_FABRIC: true,
    ENABLE_TURBO_MODULES: true,
    ENABLE_CONCURRENT_FEATURES: true,
    MEMORY_WARNING_HANDLING: true,
    BACKGROUND_APP_REFRESH: false,
  },

  // Build configurations
  BUILD: {
    DEVELOPMENT_TEAM: '', // Add your development team ID
    BUNDLE_IDENTIFIER: 'com.agura.ticketing',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    ENABLE_BITCODE: false,
    ENABLE_TESTABILITY: false,
    ENABLE_STRIP_SWIFT_SYMBOLS: true,
    ENABLE_STRIP_INSTALL: true,
  },

  // App Store configurations
  APP_STORE: {
    CATEGORY: 'Entertainment',
    SUBCATEGORY: 'Events',
    CONTENT_RATING: '4+',
    PRIVACY_URL: 'https://agura.com/privacy',
    SUPPORT_URL: 'https://agura.com/support',
    MARKETING_URL: 'https://agura.com',
  },

  // Deep linking and universal links
  DEEP_LINKING: {
    SCHEME: 'agura',
    UNIVERSAL_LINKS: [
      'https://agura.com',
      'https://agura-ticketing-backend.onrender.com',
    ],
    ASSOCIATED_DOMAINS: [
      'applinks:agura.com',
      'applinks:agura-ticketing-backend.onrender.com',
    ],
  },

  // Push notifications
  PUSH_NOTIFICATIONS: {
    ENABLED: true,
    ENVIRONMENT: 'production', // 'development' | 'production'
    CAPABILITIES: ['alert', 'badge', 'sound', 'critical-alert'],
    BACKGROUND_MODES: ['remote-notification'],
  },

  // Background modes
  BACKGROUND_MODES: [
    'fetch',
    'background-processing',
    'background-fetch',
  ],

  // Network configurations
  NETWORK: {
    ALLOWS_ARBITRARY_LOADS: false,
    REQUIRES_FORWARD_SECRECY: true,
    MINIMUM_TLS_VERSION: 'TLSv1.2',
    ALLOWED_DOMAINS: [
      'agura-ticketing-backend.onrender.com',
      'agura.com',
    ],
  },

  // Privacy configurations
  PRIVACY: {
    TRACKING_TRANSPARENCY: true,
    PRIVACY_MANIFEST: true,
    DATA_PROTECTION: 'complete', // 'complete' | 'complete-unless-open' | 'complete-until-first-user-auth' | 'none'
    USAGE_DESCRIPTIONS: {
      NSCameraUsageDescription: 'This app uses the camera to take profile pictures and document events.',
      NSPhotoLibraryUsageDescription: 'This app accesses your photo library to select profile pictures.',
      NSLocationWhenInUseUsageDescription: 'This app uses location to find nearby events and provide location-based services.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'This app uses location to find nearby events and provide location-based services.',
      NSMicrophoneUsageDescription: 'This app uses the microphone for voice notes and audio features.',
      NSFaceIDUsageDescription: 'This app uses Face ID for secure authentication.',
    },
  },
} as const;

// iOS utility functions
export const IOSUtils = {
  // Check if device supports specific iOS version
  isIOSVersionSupported: (requiredVersion: string): boolean => {
    const currentVersion = require('react-native').Platform.Version;
    return currentVersion >= parseFloat(requiredVersion);
  },

  // Check if device supports specific features
  supportsFeature: (feature: string): boolean => {
    switch (feature) {
      case 'biometric':
        return require('react-native').Platform.OS === 'ios' && 
               require('react-native').Platform.Version >= 11.0;
      case 'face-id':
        return require('react-native').Platform.OS === 'ios' && 
               require('react-native').Platform.Version >= 11.0;
      case 'touch-id':
        return require('react-native').Platform.OS === 'ios' && 
               require('react-native').Platform.Version >= 8.0;
      default:
        return false;
    }
  },

  // Get device type
  getDeviceType: (): 'iPhone' | 'iPad' | 'unknown' => {
    const { Dimensions } = require('react-native');
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;
    
    if (aspectRatio >= 1.6) {
      return 'iPhone';
    } else if (aspectRatio < 1.6) {
      return 'iPad';
    }
    return 'unknown';
  },

  // Check if device is in landscape mode
  isLandscape: (): boolean => {
    const { Dimensions } = require('react-native');
    const { width, height } = Dimensions.get('window');
    return width > height;
  },

  // Get safe area insets
  getSafeAreaInsets: () => {
    const { useSafeAreaInsets } = require('react-native-safe-area-context');
    return useSafeAreaInsets();
  },
};
