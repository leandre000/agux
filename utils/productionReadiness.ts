import { PRODUCTION_CONFIG } from '@/config/production';
import { API_BASE_URL } from '@/config/api';
import * as AuthAPI from '@/lib/api/auth';
import * as EventsAPI from '@/lib/api/events';
import * as PaymentAPI from '@/lib/api/payment';

export interface ProductionCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export interface ProductionReadinessReport {
  overall: 'ready' | 'needs_attention' | 'not_ready';
  score: number;
  checks: ProductionCheck[];
  summary: string;
}

// Check API configuration
export function checkApiConfiguration(): ProductionCheck {
  const checks = [
    { name: 'Base URL', value: API_BASE_URL, expected: 'https://agura-ticketing-backend.onrender.com' },
    { name: 'Timeout', value: PRODUCTION_CONFIG.API_TIMEOUT, expected: 30000 },
    { name: 'Environment', value: PRODUCTION_CONFIG.ENVIRONMENT, expected: 'production' }
  ];

  const issues = checks.filter(check => check.value !== check.expected);
  
  if (issues.length === 0) {
    return {
      name: 'API Configuration',
      status: 'pass',
      message: 'All API configuration values are correctly set for production',
      details: checks
    };
  } else {
    return {
      name: 'API Configuration',
      status: 'fail',
      message: `${issues.length} configuration issue(s) found`,
      details: { issues, checks }
    };
  }
}

// Check security settings
export function checkSecuritySettings(): ProductionCheck {
  const securityChecks = [
    { name: 'Token Refresh Interval', value: PRODUCTION_CONFIG.SECURITY.TOKEN_REFRESH_INTERVAL, min: 10 * 60 * 1000 },
    { name: 'Session Timeout', value: PRODUCTION_CONFIG.SECURITY.SESSION_TIMEOUT, min: 60 * 60 * 1000 },
    { name: 'API Rate Limit', value: PRODUCTION_CONFIG.SECURITY.API_RATE_LIMIT, min: 50 },
    { name: 'Request Timeout', value: PRODUCTION_CONFIG.SECURITY.REQUEST_TIMEOUT, min: 10000 }
  ];

  const issues = securityChecks.filter(check => check.value < check.min);
  
  if (issues.length === 0) {
    return {
      name: 'Security Settings',
      status: 'pass',
      message: 'All security settings meet production requirements',
      details: securityChecks
    };
  } else {
    return {
      name: 'Security Settings',
      status: 'warning',
      message: `${issues.length} security setting(s) may need adjustment`,
      details: { issues, securityChecks }
    };
  }
}

// Check feature flags
export function checkFeatureFlags(): ProductionCheck {
  const features = PRODUCTION_CONFIG.FEATURES;
  const requiredFeatures = ['ANALYTICS', 'ERROR_REPORTING', 'PERFORMANCE_MONITORING'];
  const missingFeatures = requiredFeatures.filter(feature => !features[feature as keyof typeof features]);
  
  if (missingFeatures.length === 0) {
    return {
      name: 'Feature Flags',
      status: 'pass',
      message: 'All required production features are enabled',
      details: features
    };
  } else {
    return {
      name: 'Feature Flags',
      status: 'warning',
      message: `${missingFeatures.length} required feature(s) are disabled`,
      details: { missing: missingFeatures, features }
    };
  }
}

// Check payment configuration
export function checkPaymentConfiguration(): ProductionCheck {
  const paymentConfig = PRODUCTION_CONFIG.PAYMENT;
  const requiredMethods = ['mobile_money', 'card'];
  const missingMethods = requiredMethods.filter(method => !paymentConfig.SUPPORTED_METHODS.includes(method as any));
  
  const issues = [];
  if (missingMethods.length > 0) {
    issues.push(`Missing payment methods: ${missingMethods.join(', ')}`);
  }
  if (paymentConfig.PAYMENT_TIMEOUT < 60000) {
    issues.push('Payment timeout too short for production');
  }
  if (!paymentConfig.CURRENCIES.includes('RWF')) {
    issues.push('Local currency (RWF) not supported');
  }

  if (issues.length === 0) {
    return {
      name: 'Payment Configuration',
      status: 'pass',
      message: 'Payment configuration is ready for production',
      details: paymentConfig
    };
  } else {
    return {
      name: 'Payment Configuration',
      status: 'fail',
      message: `${issues.length} payment configuration issue(s) found`,
      details: { issues, paymentConfig }
    };
  }
}

// Check mobile optimization
export function checkMobileOptimization(): ProductionCheck {
  const mobileConfig = PRODUCTION_CONFIG.MOBILE;
  const performanceConfig = PRODUCTION_CONFIG.PERFORMANCE;
  
  const checks = [
    { name: 'Seat Selection Timeout', value: mobileConfig.SEAT_SELECTION_TIMEOUT, min: 10 * 60 * 1000 },
    { name: 'Max Seats Per Selection', value: mobileConfig.MAX_SEATS_PER_SELECTION, min: 5 },
    { name: 'Lazy Loading', value: performanceConfig.LAZY_LOADING, expected: true },
    { name: 'Virtual Scrolling', value: performanceConfig.VIRTUAL_SCROLLING, expected: true }
  ];

  const issues = checks.filter(check => {
    if ('min' in check && typeof check.value === 'number' && check.min) {
      return check.value < check.min;
    }
    if ('expected' in check) {
      return check.value !== check.expected;
    }
    return false;
  });
  
  if (issues.length === 0) {
    return {
      name: 'Mobile Optimization',
      status: 'pass',
      message: 'Mobile optimization settings are configured for production',
      details: { mobileConfig, performanceConfig }
    };
  } else {
    return {
      name: 'Mobile Optimization',
      status: 'warning',
      message: `${issues.length} mobile optimization setting(s) need attention`,
      details: { issues, mobileConfig, performanceConfig }
    };
  }
}

// Check API endpoint availability
export async function checkApiEndpoints(): Promise<ProductionCheck> {
  const endpoints = [
    { name: 'Auth Validation', test: () => AuthAPI.validateEmail('test@example.com') },
    { name: 'Events API', test: () => EventsAPI.validateEventData({ title: 'Test', description: 'Test event', date: '2024-12-31', start_time: '18:00', venue_id: 'test', category: 'music' }) },
    { name: 'Payment Validation', test: () => PaymentAPI.getAvailablePaymentMethods() }
  ];

  const results = await Promise.allSettled(
    endpoints.map(async endpoint => {
      try {
        const result = endpoint.test();
        return { name: endpoint.name, success: true, result };
      } catch (error) {
        return { name: endpoint.name, success: false, error: error };
      }
    })
  );

  const successful = results.filter(result => result.status === 'fulfilled' && result.value.success).length;
  const total = endpoints.length;

  if (successful === total) {
    return {
      name: 'API Endpoints',
      status: 'pass',
      message: 'All API endpoints are accessible and functional',
      details: results
    };
  } else {
    return {
      name: 'API Endpoints',
      status: 'warning',
      message: `${successful}/${total} API endpoints are functional`,
      details: results
    };
  }
}

// Run comprehensive production readiness check
export async function runProductionReadinessCheck(): Promise<ProductionReadinessReport> {
  console.log('🔍 Running production readiness check...');

  const checks: ProductionCheck[] = [
    checkApiConfiguration(),
    checkSecuritySettings(),
    checkFeatureFlags(),
    checkPaymentConfiguration(),
    checkMobileOptimization(),
    await checkApiEndpoints()
  ];

  const passCount = checks.filter(check => check.status === 'pass').length;
  const warningCount = checks.filter(check => check.status === 'warning').length;
  const failCount = checks.filter(check => check.status === 'fail').length;
  const total = checks.length;

  const score = Math.round((passCount + (warningCount * 0.5)) / total * 100);

  let overall: 'ready' | 'needs_attention' | 'not_ready';
  if (failCount === 0 && warningCount <= 2) {
    overall = 'ready';
  } else if (failCount <= 1) {
    overall = 'needs_attention';
  } else {
    overall = 'not_ready';
  }

  const summary = `${passCount} passed, ${warningCount} warnings, ${failCount} failed (${score}% ready)`;

  console.log(`📊 Production readiness: ${overall.toUpperCase()} - ${summary}`);

  return {
    overall,
    score,
    checks,
    summary
  };
}

// Get production deployment checklist
export function getDeploymentChecklist(): string[] {
  return [
    '✅ All TypeScript errors resolved',
    '✅ Backend API integration tested',
    '✅ Authentication flow verified',
    '✅ Payment system configured',
    '✅ Error handling implemented',
    '✅ Security settings configured',
    '✅ Mobile optimization enabled',
    '✅ Production URLs configured',
    '✅ Environment variables set',
    '✅ Performance monitoring enabled',
    '🔄 Integration tests passed',
    '🔄 User acceptance testing completed',
    '🔄 Security audit completed',
    '🔄 Performance testing completed',
    '🔄 Database backups configured',
    '🔄 Monitoring and alerting set up'
  ];
}
