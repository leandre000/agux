import { API_BASE_URL } from '@/config/api';
import { SECURITY_CONFIG } from '@/config/security';

export interface BackendTestResult {
  success: boolean;
  endpoint: string;
  status: number;
  responseTime: number;
  cors: boolean;
  headers: Record<string, string>;
  error?: string;
  data?: any;
}

export interface BackendHealthCheck {
  overall: boolean;
  tests: BackendTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    averageResponseTime: number;
  };
}

export class BackendTester {
  private static instance: BackendTester;
  private testResults: BackendTestResult[] = [];

  static getInstance(): BackendTester {
    if (!BackendTester.instance) {
      BackendTester.instance = new BackendTester();
    }
    return BackendTester.instance;
  }

  // Test basic connectivity
  async testConnectivity(): Promise<BackendTestResult> {
    const startTime = Date.now();
    const endpoint = `${API_BASE_URL}/`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Agura-Mobile/1.0.0',
        },
        mode: 'cors',
      });

      const responseTime = Date.now() - startTime;
      const cors = this.checkCORSHeaders(response.headers);
      
      const result: BackendTestResult = {
        success: response.ok,
        endpoint,
        status: response.status,
        responseTime,
        cors,
        headers: this.extractHeaders(response.headers),
        data: response.ok ? await response.text() : undefined,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: BackendTestResult = {
        success: false,
        endpoint,
        status: 0,
        responseTime,
        cors: false,
        headers: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test authentication endpoints
  async testAuthEndpoints(): Promise<BackendTestResult[]> {
    const endpoints = [
      '/api/users/login',
      '/api/users/register',
      '/api/users/forgot-password',
      '/api/users/verify',
    ];

    const results: BackendTestResult[] = [];
    
    for (const endpoint of endpoints) {
      const result = await this.testEndpoint(endpoint, 'POST', {
        test: 'data',
      });
      results.push(result);
    }

    return results;
  }

  // Test protected endpoints (should return 401 without auth)
  async testProtectedEndpoints(): Promise<BackendTestResult[]> {
    const endpoints = [
      '/api/users/me',
      '/api/events',
      '/api/tickets',
    ];

    const results: BackendTestResult[] = [];
    
    for (const endpoint of endpoints) {
      const result = await this.testEndpoint(endpoint, 'GET');
      results.push(result);
    }

    return results;
  }

  // Test CORS preflight
  async testCORSPreflight(): Promise<BackendTestResult> {
    const startTime = Date.now();
    const endpoint = `${API_BASE_URL}/api/users/login`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://agura.com',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
        mode: 'cors',
      });

      const responseTime = Date.now() - startTime;
      const cors = this.checkCORSHeaders(response.headers);
      
      const result: BackendTestResult = {
        success: response.ok,
        endpoint: `${endpoint} (OPTIONS)`,
        status: response.status,
        responseTime,
        cors,
        headers: this.extractHeaders(response.headers),
        data: response.ok ? 'CORS preflight successful' : undefined,
        error: response.ok ? undefined : 'CORS preflight failed',
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: BackendTestResult = {
        success: false,
        endpoint: `${endpoint} (OPTIONS)`,
        status: 0,
        responseTime,
        cors: false,
        headers: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Test rate limiting
  async testRateLimiting(): Promise<BackendTestResult> {
    const startTime = Date.now();
    const endpoint = `${API_BASE_URL}/api/users/login`;
    const requests = Array.from({ length: 10 }, () => 
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
        mode: 'cors',
      })
    );

    try {
      const responses = await Promise.all(requests);
      const responseTime = Date.now() - startTime;
      
      // Check if any requests were rate limited (429 status)
      const rateLimited = responses.some(r => r.status === 429);
      const cors = responses.every(r => this.checkCORSHeaders(r.headers));
      
      const result: BackendTestResult = {
        success: true,
        endpoint: `${endpoint} (rate limit test)`,
        status: rateLimited ? 429 : 200,
        responseTime,
        cors,
        headers: this.extractHeaders(responses[0].headers),
        data: `Rate limiting ${rateLimited ? 'enabled' : 'not detected'}`,
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: BackendTestResult = {
        success: false,
        endpoint: `${endpoint} (rate limit test)`,
        status: 0,
        responseTime,
        cors: false,
        headers: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Generic endpoint test
  private async testEndpoint(
    endpoint: string, 
    method: string = 'GET', 
    body?: any
  ): Promise<BackendTestResult> {
    const startTime = Date.now();
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Agura-Mobile/1.0.0',
        },
        mode: 'cors',
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      const cors = this.checkCORSHeaders(response.headers);
      
      const result: BackendTestResult = {
        success: response.ok,
        endpoint,
        status: response.status,
        responseTime,
        cors,
        headers: this.extractHeaders(response.headers),
        data: response.ok ? await response.text() : undefined,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };

      this.testResults.push(result);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: BackendTestResult = {
        success: false,
        endpoint,
        status: 0,
        responseTime,
        cors: false,
        headers: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.testResults.push(result);
      return result;
    }
  }

  // Check CORS headers
  private checkCORSHeaders(headers: Headers): boolean {
    const requiredHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
    ];

    return requiredHeaders.every(header => headers.has(header));
  }

  // Extract relevant headers
  private extractHeaders(headers: Headers): Record<string, string> {
    const relevantHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-max-age',
      'content-type',
      'server',
      'x-powered-by',
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security',
    ];

    const extracted: Record<string, string> = {};
    relevantHeaders.forEach(header => {
      if (headers.has(header)) {
        extracted[header] = headers.get(header) || '';
      }
    });

    return extracted;
  }

  // Run comprehensive backend test
  async runFullTest(): Promise<BackendHealthCheck> {
    console.log('🔍 Starting comprehensive backend test...');
    
    // Test basic connectivity
    await this.testConnectivity();
    
    // Test CORS preflight
    await this.testCORSPreflight();
    
    // Test authentication endpoints
    await this.testAuthEndpoints();
    
    // Test protected endpoints
    await this.testProtectedEndpoints();
    
    // Test rate limiting
    await this.testRateLimiting();
    
    return this.generateReport();
  }

  // Generate test report
  private generateReport(): BackendHealthCheck {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.success).length;
    const failed = total - passed;
    const averageResponseTime = this.testResults.reduce((sum, r) => sum + r.responseTime, 0) / total;

    const summary = {
      total,
      passed,
      failed,
      averageResponseTime: Math.round(averageResponseTime),
    };

    console.log('📊 Backend Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Average Response Time: ${summary.averageResponseTime}ms`);
    console.log(`🌐 CORS Support: ${this.testResults.every(r => r.cors) ? '✅ Full' : '⚠️ Partial'}`);

    return {
      overall: failed === 0,
      tests: this.testResults,
      summary,
    };
  }

  // Clear test results
  clearResults(): void {
    this.testResults = [];
  }

  // Get test results
  getResults(): BackendTestResult[] {
    return this.testResults;
  }
}

// Export singleton instance
export const backendTester = BackendTester.getInstance();

// Convenience function for quick testing
export const testBackend = async (): Promise<BackendHealthCheck> => {
  return await backendTester.runFullTest();
};
