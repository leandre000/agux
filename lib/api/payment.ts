import { apiGet, apiPost, apiPut } from "@/config/api";

// Payment Method Types
export type PaymentMethod = 'mobile_money' | 'card' | 'paypal' | 'bank_transfer';

// Payment Status
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

// Mobile Money Providers
export type MobileMoneyProvider = 'mtn' | 'airtel' | 'mpesa' | 'orange';

// Card Types
export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover';

// Payment Request Interfaces
export interface PaymentRequest {
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  description: string;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface MobileMoneyPaymentRequest extends PaymentRequest {
  payment_method: 'mobile_money';
  phone_number: string;
  provider: MobileMoneyProvider;
}

export interface CardPaymentRequest extends PaymentRequest {
  payment_method: 'card';
  card_token?: string;
  card_details?: {
    number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    holder_name: string;
  };
  save_card?: boolean;
}

export interface PayPalPaymentRequest extends PaymentRequest {
  payment_method: 'paypal';
  return_url: string;
  cancel_url: string;
}

export interface BankTransferPaymentRequest extends PaymentRequest {
  payment_method: 'bank_transfer';
  bank_code: string;
  account_number: string;
  account_name: string;
}

// Payment Response Interfaces
export interface PaymentResponse {
  success: boolean;
  message?: string;
  payment_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference: string;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  redirect_url?: string;
  qr_code?: string;
  transaction_id?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message?: string;
  payment: PaymentResponse;
  verified: boolean;
}

export interface PaymentMethodsResponse {
  success: boolean;
  payment_methods: {
    method: PaymentMethod;
    name: string;
    description: string;
    enabled: boolean;
    fees_percentage?: number;
    fees_fixed?: number;
    min_amount?: number;
    max_amount?: number;
    icon?: string;
  }[];
}

export interface PaymentHistoryResponse {
  success: boolean;
  payments: PaymentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Payment Functions
export async function initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  try {
    let endpoint = '/api/payments/initiate';
    
    // Route to specific payment method endpoint
    switch (paymentData.payment_method) {
      case 'mobile_money':
        endpoint = '/api/payments/mobile-money';
        break;
      case 'card':
        endpoint = '/api/payments/card';
        break;
      case 'paypal':
        endpoint = '/api/payments/paypal';
        break;
      case 'bank_transfer':
        endpoint = '/api/payments/bank-transfer';
        break;
    }
    
    const response = await apiPost<PaymentResponse, PaymentRequest>(endpoint, paymentData);
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid payment data. Please check your information.");
    } else if (error.status === 402) {
      throw new Error("Payment failed. Please try a different payment method.");
    } else if (error.status === 422) {
      throw new Error("Payment validation failed. Please check your input.");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function verifyPayment(paymentId: string): Promise<PaymentVerificationResponse> {
  try {
    const response = await apiGet<PaymentVerificationResponse>(`/api/payments/${paymentId}/verify`);
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Payment not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  try {
    const response = await apiGet<PaymentResponse>(`/api/payments/${paymentId}/status`);
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Payment not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getAvailablePaymentMethods(): Promise<PaymentMethodsResponse> {
  try {
    const response = await apiGet<PaymentMethodsResponse>('/api/payments/methods');
    return response.data;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getPaymentHistory(
  page: number = 1, 
  limit: number = 20
): Promise<PaymentHistoryResponse> {
  try {
    const response = await apiGet<PaymentHistoryResponse>(`/api/payments/history?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function cancelPayment(paymentId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPut<{ success: boolean; message?: string }>(`/api/payments/${paymentId}/cancel`);
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Payment cannot be cancelled at this stage");
    } else if (error.status === 404) {
      throw new Error("Payment not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function refundPayment(
  paymentId: string, 
  amount?: number, 
  reason?: string
): Promise<{ success: boolean; message?: string; refund_id?: string }> {
  try {
    const body = {
      amount,
      reason: reason || 'Customer request'
    };
    
    const response = await apiPost<{ success: boolean; message?: string; refund_id?: string }>(
      `/api/payments/${paymentId}/refund`, 
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Payment cannot be refunded at this stage");
    } else if (error.status === 404) {
      throw new Error("Payment not found");
    } else if (error.status === 422) {
      throw new Error("Invalid refund amount");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Mobile Money Specific Functions
export async function sendMobileMoneyPrompt(
  paymentId: string, 
  phoneNumber: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const body = { phone_number: phoneNumber };
    const response = await apiPost<{ success: boolean; message?: string }>(
      `/api/payments/${paymentId}/mobile-money/prompt`, 
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid phone number");
    } else if (error.status === 404) {
      throw new Error("Payment not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Card Specific Functions
export async function saveCard(
  cardDetails: {
    number: string;
    expiry_month: string;
    expiry_year: string;
    cvv: string;
    holder_name: string;
  }
): Promise<{ success: boolean; card_token: string; message?: string }> {
  try {
    const response = await apiPost<{ success: boolean; card_token: string; message?: string }>(
      '/api/payments/cards/save', 
      cardDetails
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid card details");
    } else if (error.status === 422) {
      throw new Error("Card validation failed");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getSavedCards(): Promise<{
  success: boolean;
  cards: {
    card_token: string;
    last_four: string;
    expiry_month: string;
    expiry_year: string;
    holder_name: string;
    card_type: CardType;
    is_default: boolean;
  }[];
}> {
  try {
    const response = await apiGet<{
      success: boolean;
      cards: {
        card_token: string;
        last_four: string;
        expiry_month: string;
        expiry_year: string;
        holder_name: string;
        card_type: CardType;
        is_default: boolean;
      }[];
    }>('/api/payments/cards/saved');
    return response.data;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function deleteSavedCard(cardToken: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPut<{ success: boolean; message?: string }>(
      `/api/payments/cards/${cardToken}/delete`
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Card not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Utility Functions
export function formatAmount(amount: number, currency: string = 'RWF'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  // Check if it's a valid card number (13-19 digits)
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) return false;
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function validatePhoneNumber(phone: string, provider?: MobileMoneyProvider): boolean {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Basic validation for different providers
  switch (provider) {
    case 'mtn':
      return /^(07|2507)\d{7}$/.test(cleanPhone);
    case 'airtel':
      return /^(07|2507)\d{7}$/.test(cleanPhone);
    case 'mpesa':
      return /^(07|2507)\d{7}$/.test(cleanPhone);
    case 'orange':
      return /^(07|2507)\d{7}$/.test(cleanPhone);
    default:
      // Generic validation for Rwanda phone numbers
      return /^(07|2507)\d{7}$/.test(cleanPhone);
  }
}
