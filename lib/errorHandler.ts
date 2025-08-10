import { Alert } from 'react-native';

export interface ErrorInfo {
  message: string;
  stack?: string;
  status?: number;
  data?: any;
}

export class AppError extends Error {
  public status?: number;
  public data?: any;
  public isDatabaseError: boolean;
  public isNetworkError: boolean;
  public isAuthError: boolean;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.data = data;
    
    // Detect error types
    this.isDatabaseError = this.detectDatabaseError(message);
    this.isNetworkError = this.detectNetworkError(message);
    this.isAuthError = this.detectAuthError(message);
  }

  private detectDatabaseError(message: string): boolean {
    const databaseKeywords = [
      'alias',
      'include statement',
      'Section',
      'TicketCategory',
      'database',
      'sequelize',
      'prisma',
      'foreign key',
      'constraint',
      'relation'
    ];
    
    return databaseKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private detectNetworkError(message: string): boolean {
    const networkKeywords = [
      'network',
      'timeout',
      'connection',
      'fetch',
      'request failed',
      'status code'
    ];
    
    return networkKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private detectAuthError(message: string): boolean {
    const authKeywords = [
      'unauthorized',
      'forbidden',
      'token',
      'authentication',
      'login required'
    ];
    
    return authKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  public getUserFriendlyMessage(): string {
    if (this.isDatabaseError) {
      if (this.message.includes('alias') || this.message.includes('include statement')) {
        return "We're experiencing a technical issue with our database. Our team has been notified and is working to fix it.";
      }
      if (this.message.includes('Section') && this.message.includes('TicketCategory')) {
        return "There's a temporary issue with our ticket system. Please try again in a few minutes.";
      }
      return "A database error occurred. Our technical team has been notified.";
    }

    if (this.isNetworkError) {
      if (this.message.includes('timeout')) {
        return "The request took too long. Please check your internet connection and try again.";
      }
      if (this.message.includes('status code 404')) {
        return "The requested information could not be found. Please try again later.";
      }
      return "Network connection issue. Please check your internet connection and try again.";
    }

    if (this.isAuthError) {
      if (this.message.includes('unauthorized')) {
        return "Please log in to access this feature.";
      }
      if (this.message.includes('token')) {
        return "Your session has expired. Please log in again.";
      }
      return "Authentication error. Please try logging in again.";
    }

    // Default user-friendly message
    return "Something went wrong. Please try again or contact support if the problem persists.";
  }

  public shouldShowToUser(): boolean {
    // Don't show technical database errors to users in production
    if (this.isDatabaseError && !__DEV__) {
      return false;
    }
    
    // Always show auth errors
    if (this.isAuthError) {
      return true;
    }
    
    // Show network errors
    if (this.isNetworkError) {
      return true;
    }
    
    return true;
  }
}

export function handleError(error: unknown, context?: string): AppError {
  let appError: AppError;
  
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(error.message);
  } else {
    appError = new AppError('An unknown error occurred');
  }

  // Log error for debugging
  console.error(`Error in ${context || 'unknown context'}:`, {
    message: appError.message,
    stack: appError.stack,
    status: appError.status,
    data: appError.data,
    type: {
      isDatabaseError: appError.isDatabaseError,
      isNetworkError: appError.isNetworkError,
      isAuthError: appError.isAuthError
    }
  });

  // In production, you would send this to your error reporting service
  if (__DEV__) {
    console.log('Error details logged for development');
  }

  return appError;
}

export function showErrorAlert(error: AppError, title: string = 'Error') {
  if (error.shouldShowToUser()) {
    Alert.alert(
      title,
      error.getUserFriendlyMessage(),
      [{ text: 'OK' }]
    );
  }
}

export function isDatabaseError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isDatabaseError;
  }
  
  if (error instanceof Error) {
    const appError = new AppError(error.message);
    return appError.isDatabaseError;
  }
  
  return false;
}
