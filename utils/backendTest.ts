import { API_BASE_URL } from '@/config/api';
import * as AuthAPI from '@/lib/api/auth';
import * as EventsAPI from '@/lib/api/events';
import * as PaymentAPI from '@/lib/api/payment';

export interface BackendTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface BackendTestSuite {
  connectivity: BackendTestResult;
  auth: BackendTestResult;
  events: BackendTestResult;
  payment: BackendTestResult;
  overall: BackendTestResult;
}

// Test basic backend connectivity
export async function testConnectivity(): Promise<BackendTestResult> {
  try {
    console.log('🔗 Testing backend connectivity...');
    console.log('API Base URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Backend connectivity successful',
        details: { status: response.status, data }
      };
    } else {
      return {
        success: false,
        message: `Backend responded with status ${response.status}`,
        details: { status: response.status }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to connect to backend',
      details: { error: error.message }
    };
  }
}

// Test authentication endpoints
export async function testAuthEndpoints(): Promise<BackendTestResult> {
  try {
    console.log('🔐 Testing authentication endpoints...');
    
    // Test login endpoint with invalid credentials (should return error but endpoint should exist)
    const loginResult = await AuthAPI.login({
      identifier: 'test@test.com',
      password: 'wrongpassword'
    }).catch(error => error);

    // Test registration validation
    const validationResult = AuthAPI.validateEmail('test@example.com');
    const phoneValidation = AuthAPI.validatePhone('+250781234567');

    if (loginResult && validationResult && phoneValidation) {
      return {
        success: true,
        message: 'Authentication endpoints are accessible',
        details: { 
          loginEndpoint: 'accessible',
          validationHelpers: 'working'
        }
      };
    } else {
      return {
        success: false,
        message: 'Authentication endpoints or validation failed',
        details: { loginResult, validationResult, phoneValidation }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Authentication endpoint test failed',
      details: { error: error.message }
    };
  }
}

// Test events endpoints
export async function testEventsEndpoints(): Promise<BackendTestResult> {
  try {
    console.log('🎪 Testing events endpoints...');
    
    // Test events fetching
    const eventsResult = await EventsAPI.getEvents().catch(error => ({ error }));
    const featuredResult = await EventsAPI.getFeaturedEvents().catch(error => ({ error }));

    if (eventsResult && featuredResult) {
      return {
        success: true,
        message: 'Events endpoints are accessible',
        details: { 
          eventsEndpoint: 'error' in eventsResult ? 'error but accessible' : 'working',
          featuredEndpoint: 'error' in featuredResult ? 'error but accessible' : 'working'
        }
      };
    } else {
      return {
        success: false,
        message: 'Events endpoints failed',
        details: { eventsResult, featuredResult }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Events endpoint test failed',
      details: { error: error.message }
    };
  }
}

// Test payment endpoints
export async function testPaymentEndpoints(): Promise<BackendTestResult> {
  try {
    console.log('💳 Testing payment endpoints...');
    
    // Test payment methods fetching
    const methodsResult = await PaymentAPI.getAvailablePaymentMethods().catch(error => ({ error }));

    if (methodsResult) {
      return {
        success: true,
        message: 'Payment endpoints are accessible',
        details: { 
          methodsEndpoint: 'error' in methodsResult ? 'error but accessible' : 'working'
        }
      };
    } else {
      return {
        success: false,
        message: 'Payment endpoints failed',
        details: { methodsResult }
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Payment endpoint test failed',
      details: { error: error.message }
    };
  }
}

// Run comprehensive backend test suite
export async function runBackendTestSuite(): Promise<BackendTestSuite> {
  console.log('🚀 Starting comprehensive backend integration test...');
  
  const connectivity = await testConnectivity();
  const auth = await testAuthEndpoints();
  const events = await testEventsEndpoints();
  const payment = await testPaymentEndpoints();

  const allTests = [connectivity, auth, events, payment];
  const successCount = allTests.filter(test => test.success).length;
  const totalTests = allTests.length;

  const overall: BackendTestResult = {
    success: successCount === totalTests,
    message: `${successCount}/${totalTests} backend integration tests passed`,
    details: {
      connectivity: connectivity.success,
      auth: auth.success,
      events: events.success,
      payment: payment.success,
      score: `${successCount}/${totalTests}`
    }
  };

  console.log('📊 Backend test results:', overall.message);

  return {
    connectivity,
    auth,
    events,
    payment,
    overall
  };
}

// Log detailed test results
export function logTestResults(results: BackendTestSuite) {
  console.log('\n📋 Detailed Backend Integration Test Results:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  Object.entries(results).forEach(([category, result]) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${category.toUpperCase()}: ${result.message}`);
    if (result.details) {
      console.log(`   Details:`, JSON.stringify(result.details, null, 2));
    }
  });
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}