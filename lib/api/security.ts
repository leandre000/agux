import { createApiClient } from "@/config/api";
import { getToken } from "@/lib/authToken";

// Security validation utilities
export class SecurityValidator {
  // Validate admin permissions
  static async validateAdminPermission(requiredPermission: string): Promise<boolean> {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await createApiClient().get('/api/admin/validate-permission', {
        params: { permission: requiredPermission }
      });
      
      return response.data?.hasPermission || false;
    } catch {
      return false;
    }
  }

  // Validate user ownership of resource
  static async validateResourceOwnership(resourceType: string, resourceId: string): Promise<boolean> {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await createApiClient().get('/api/validate-ownership', {
        params: { 
          resource_type: resourceType,
          resource_id: resourceId 
        }
      });
      
      return response.data?.isOwner || false;
    } catch {
      return false;
    }
  }

  // Validate event access permissions
  static async validateEventAccess(eventId: string, action: 'view' | 'edit' | 'delete'): Promise<boolean> {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await createApiClient().get('/api/events/validate-access', {
        params: { 
          event_id: eventId,
          action: action 
        }
      });
      
      return response.data?.hasAccess || false;
    } catch {
      return false;
    }
  }

  // Validate ticket purchase permissions
  static async validateTicketPurchase(categoryId: string, quantity: number): Promise<{
    canPurchase: boolean;
    maxAllowed: number;
    reason?: string;
  }> {
    try {
      const token = await getToken();
      if (!token) {
        return { canPurchase: false, maxAllowed: 0, reason: 'Authentication required' };
      }

      const response = await createApiClient().post('/api/tickets/validate-purchase', {
        category_id: categoryId,
        quantity: quantity
      });
      
      return response.data;
    } catch (error: any) {
      return { 
        canPurchase: false, 
        maxAllowed: 0, 
        reason: error.message || 'Validation failed' 
      };
    }
  }

  // Rate limiting check
  static async checkRateLimit(action: string, identifier?: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    try {
      const token = await getToken();
      const response = await createApiClient().get('/api/rate-limit/check', {
        params: { 
          action: action,
          identifier: identifier 
        }
      });
      
      return response.data;
    } catch {
      return { allowed: true, remaining: 100, resetTime: Date.now() + 3600000 };
    }
  }

  // Validate payment method
  static async validatePaymentMethod(method: string, details: any): Promise<{
    valid: boolean;
    reason?: string;
  }> {
    try {
      const response = await createApiClient().post('/api/payment/validate-method', {
        method: method,
        details: details
      });
      
      return response.data;
    } catch (error: any) {
      return { valid: false, reason: error.message || 'Payment method validation failed' };
    }
  }

  // Validate seat selection
  static async validateSeatSelection(seatIds: string[], eventId: string): Promise<{
    valid: boolean;
    availableSeats: string[];
    unavailableSeats: string[];
    reason?: string;
  }> {
    try {
      const response = await createApiClient().post('/api/seats/validate-selection', {
        seat_ids: seatIds,
        event_id: eventId
      });
      
      return response.data;
    } catch (error: any) {
      return { 
        valid: false, 
        availableSeats: [], 
        unavailableSeats: seatIds,
        reason: error.message || 'Seat validation failed' 
      };
    }
  }
}

// Input sanitization utilities
export class InputSanitizer {
  // Sanitize string input
  static sanitizeString(input: string): string {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[&]/g, '&amp;') // Escape ampersands
      .replace(/["]/g, '&quot;') // Escape quotes
      .replace(/[']/g, '&#x27;') // Escape apostrophes
      .replace(/[/]/g, '&#x2F;'); // Escape forward slashes
  }

  // Sanitize email
  static sanitizeEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase().trim();
  }

  // Sanitize phone number
  static sanitizePhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^\d+]/g, ''); // Keep only digits and plus sign
  }

  // Sanitize price
  static sanitizePrice(price: number): number {
    if (typeof price !== 'number' || isNaN(price)) return 0;
    return Math.max(0, Math.round(price * 100) / 100); // Round to 2 decimal places
  }

  // Sanitize date
  static sanitizeDate(date: string): string {
    if (!date) return '';
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return '';
    return parsed.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  }

  // Sanitize object recursively
  static sanitizeObject<T>(obj: T): T {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item)) as T;
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'number') {
        sanitized[key] = this.sanitizePrice(value);
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized as T;
  }
}

// Encryption utilities
export class EncryptionUtils {
  // Generate secure random string
  static generateSecureString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate secure ID
  static generateSecureId(): string {
    return `${Date.now()}-${this.generateSecureString(8)}`;
  }

  // Hash sensitive data (for logging purposes)
  static hashSensitiveData(data: string): string {
    if (!data) return '';
    // Simple hash for logging - in production, use proper hashing
    return btoa(data).substring(0, 8) + '***';
  }
}

// Audit logging utilities
export class AuditLogger {
  // Log admin action
  static async logAdminAction(action: string, resource: string, resourceId: string, details?: any) {
    try {
      await createApiClient().post('/api/admin/audit-log', {
        action: action,
        resource: resource,
        resource_id: resourceId,
        details: details,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Silently fail audit logging to not break main functionality
      console.warn('Audit logging failed for action:', action);
    }
  }

  // Log user action
  static async logUserAction(action: string, resource: string, resourceId: string, details?: any) {
    try {
      await createApiClient().post('/api/user/audit-log', {
        action: action,
        resource: resource,
        resource_id: resourceId,
        details: details,
        timestamp: new Date().toISOString()
      });
    } catch {
      // Silently fail audit logging to not break main functionality
      console.warn('Audit logging failed for action:', action);
    }
  }

  // Log security event
  static async logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: any) {
    try {
      await createApiClient().post('/api/security/log', {
        event: event,
        severity: severity,
        details: details,
        timestamp: new Date().toISOString(),
        ip_address: 'client-ip', // Would be set by middleware
        user_agent: 'client-user-agent' // Would be set by middleware
      });
    } catch {
      // Silently fail security logging to not break main functionality
      console.warn('Security logging failed for event:', event);
    }
  }
}

// CSRF protection utilities
export class CSRFProtection {
  // Generate CSRF token
  static async generateCSRFToken(): Promise<string> {
    try {
      const response = await createApiClient().get('/api/csrf/token');
      return response.data?.token || '';
    } catch {
      return '';
    }
  }

  // Validate CSRF token
  static async validateCSRFToken(token: string): Promise<boolean> {
    try {
      const response = await createApiClient().post('/api/csrf/validate', { token });
      return response.data?.valid || false;
    } catch {
      return false;
    }
  }
}

// Session management utilities
export class SessionManager {
  // Check session validity
  static async checkSessionValidity(): Promise<{
    valid: boolean;
    expiresAt: number;
    userId: string;
  }> {
    try {
      const response = await createApiClient().get('/api/session/check');
      return response.data;
    } catch {
      return { valid: false, expiresAt: 0, userId: '' };
    }
  }

  // Refresh session
  static async refreshSession(): Promise<{
    success: boolean;
    newExpiresAt: number;
  }> {
    try {
      const response = await createApiClient().post('/api/session/refresh');
      return response.data;
    } catch {
      return { success: false, newExpiresAt: 0 };
    }
  }

  // Invalidate session
  static async invalidateSession(): Promise<boolean> {
    try {
      await createApiClient().post('/api/session/invalidate');
      return true;
    } catch {
      return false;
    }
  }
}

// Security middleware for API calls
export class SecurityMiddleware {
  // Pre-request security checks
  static async preRequestCheck(endpoint: string, method: string, data?: any): Promise<{
    allowed: boolean;
    reason?: string;
    sanitizedData?: any;
  }> {
    // Check rate limiting
    const rateLimit = await SecurityValidator.checkRateLimit(`${method}:${endpoint}`);
    if (!rateLimit.allowed) {
      return { allowed: false, reason: 'Rate limit exceeded' };
    }

    // Sanitize input data
    const sanitizedData = data ? InputSanitizer.sanitizeObject(data) : undefined;

    // Log security event for sensitive operations
    if (method === 'DELETE' || endpoint.includes('/admin/')) {
      await AuditLogger.logSecurityEvent('Sensitive operation attempted', 'medium', {
        endpoint,
        method,
        timestamp: new Date().toISOString()
      });
    }

    return { allowed: true, sanitizedData };
  }

  // Post-request security checks
  static async postRequestCheck(endpoint: string, method: string, response: any): Promise<void> {
    // Log successful operations
    if (response.status >= 200 && response.status < 300) {
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        await AuditLogger.logUserAction(
          `${method.toLowerCase()}_${endpoint.split('/').pop()}`,
          endpoint.split('/')[2] || 'unknown',
          response.data?.id || 'unknown'
        );
      }
    }

    // Log failed operations
    if (response.status >= 400) {
      await AuditLogger.logSecurityEvent('API request failed', 'low', {
        endpoint,
        method,
        status: response.status,
        timestamp: new Date().toISOString()
      });
    }
  }
}
