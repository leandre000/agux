import { apiGet, apiPost, apiPut } from "@/config/api";
import {
    PaginatedResponse,
    Ticket,
    TicketPurchaseRequest,
    TicketPurchaseResponse,
    Seat
} from "@/types/ticketing";

// Get user's tickets
export async function getUserTickets(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Ticket>>(`/api/tickets/my-tickets?${params.toString()}`);
}

// Get ticket by ID
export async function getTicketById(ticketId: string) {
  return apiGet<Ticket>(`/api/tickets/${ticketId}`);
}

// Purchase tickets
export async function purchaseTickets(purchaseData: TicketPurchaseRequest) {
  return apiPost<TicketPurchaseResponse>("/api/tickets/purchase", purchaseData);
}

// Get tickets by event
export async function getTicketsByEvent(eventId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Ticket>>(`/api/events/${eventId}/tickets?${params.toString()}`);
}

// Get tickets by user for specific event
export async function getUserTicketsByEvent(eventId: string) {
  return apiGet<Ticket[]>(`/api/events/${eventId}/my-tickets`);
}

// Validate ticket by QR code
export async function validateTicket(qrCode: string) {
  return apiGet<{
    valid: boolean;
    ticket?: Ticket;
    message?: string;
  }>(`/api/tickets/validate/${encodeURIComponent(qrCode)}`);
}

// Use ticket (mark as used)
export async function useTicket(ticketId: string) {
  return apiPut<Ticket>(`/api/tickets/${ticketId}/use`);
}

// Refund ticket
export async function refundTicket(ticketId: string, reason?: string) {
  return apiPut<Ticket>(`/api/tickets/${ticketId}/refund`, { reason });
}

// Cancel ticket
export async function cancelTicket(ticketId: string, reason?: string) {
  return apiPut<Ticket>(`/api/tickets/${ticketId}/cancel`, { reason });
}

// Transfer ticket to another user
export async function transferTicket(ticketId: string, newUserId: string) {
  return apiPut<Ticket>(`/api/tickets/${ticketId}/transfer`, { new_user_id: newUserId });
}

// Get ticket statistics
export async function getTicketStats(ticketId: string) {
  return apiGet<{
    ticket_id: string;
    purchase_date: string;
    days_since_purchase: number;
    days_until_event: number;
    is_expired: boolean;
    can_refund: boolean;
    refund_deadline?: string;
  }>(`/api/tickets/${ticketId}/stats`);
}

// Get ticket QR code
export async function getTicketQRCode(ticketId: string) {
  return apiGet<{
    qr_code: string;
    qr_code_url: string;
  }>(`/api/tickets/${ticketId}/qr-code`);
}

// Download ticket PDF
export async function downloadTicketPDF(ticketId: string) {
  return apiGet<{ pdf_url: string }>(`/api/tickets/${ticketId}/pdf`);
}

// Send ticket to email
export async function sendTicketToEmail(ticketId: string, email: string) {
  return apiPost<{ message: string }>(`/api/tickets/${ticketId}/send-email`, { email });
}

// Send ticket to phone (SMS)
export async function sendTicketToPhone(ticketId: string, phone: string) {
  return apiPost<{ message: string }>(`/api/tickets/${ticketId}/send-sms`, { phone });
}

// Get ticket purchase history
export async function getTicketPurchaseHistory(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<{
    purchase_id: string;
    purchase_date: string;
    total_amount: number;
    currency: 'RWF' | 'USD';
    ticket_count: number;
    event_title: string;
    event_date: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    tickets: Ticket[];
  }>>(`/api/tickets/purchase-history?${params.toString()}`);
}

// Get ticket analytics (Admin only)
export async function getTicketAnalytics(eventId?: string, dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{
    total_tickets_sold: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    average_ticket_price: number;
    tickets_by_status: {
      active: number;
      used: number;
      refunded: number;
      cancelled: number;
      expired: number;
    };
    daily_sales: {
      date: string;
      tickets_sold: number;
      revenue: number;
    }[];
  }>(`/api/tickets/analytics?${params.toString()}`);
}

// Get all tickets (Admin only)
export async function getAllTickets(page: number = 1, limit: number = 50, filters?: {
  event_id?: string;
  user_id?: string;
  status?: 'active' | 'used' | 'refunded' | 'cancelled' | 'expired';
  date_from?: string;
  date_to?: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (filters?.event_id) params.append('event_id', filters.event_id);
  if (filters?.user_id) params.append('user_id', filters.user_id);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  
  return apiGet<PaginatedResponse<Ticket>>(`/api/tickets?${params.toString()}`);
}

// Bulk refund tickets (Admin only)
export async function bulkRefundTickets(ticketIds: string[], reason?: string) {
  return apiPost<{ refunded_count: number; failed_count: number; errors: string[] }>(
    "/api/tickets/bulk-refund",
    { ticket_ids: ticketIds, reason }
  );
}

// Bulk cancel tickets (Admin only)
export async function bulkCancelTickets(ticketIds: string[], reason?: string) {
  return apiPost<{ cancelled_count: number; failed_count: number; errors: string[] }>(
    "/api/tickets/bulk-cancel",
    { ticket_ids: ticketIds, reason }
  );
}

// Get ticket export data (Admin only)
export async function exportTickets(eventId?: string, format: 'csv' | 'excel' = 'csv') {
  const params = new URLSearchParams({ format });
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{ download_url: string }>(`/api/tickets/export?${params.toString()}`);
}

// Validate ticket purchase request
export function validateTicketPurchase(purchase: TicketPurchaseRequest): string[] {
  const errors: string[] = [];
  
  if (!purchase.category_id) {
    errors.push('Category ID is required');
  }
  
  if (purchase.quantity < 1 || purchase.quantity > 50) {
    errors.push('Quantity must be between 1 and 50');
  }
  
  if (!purchase.holder_names || purchase.holder_names.length === 0) {
    errors.push('Holder names are required');
  }
  
  if (purchase.holder_names && purchase.holder_names.length !== purchase.quantity) {
    errors.push('Number of holder names must match quantity');
  }
  
  if (purchase.holder_names) {
    purchase.holder_names.forEach((name, index) => {
      if (!name || name.trim().length < 2) {
        errors.push(`Holder name at index ${index} must be at least 2 characters long`);
      }
    });
  }
  

  
  if (!purchase.payment_method) {
    errors.push('Payment method is required');
  }
  
  if (!['mobile_money', 'card', 'bank_transfer'].includes(purchase.payment_method)) {
    errors.push('Invalid payment method');
  }
  
  // Validate payment details based on payment method
  if (purchase.payment_method === 'mobile_money' && !purchase.payment_details?.phone_number) {
    errors.push('Phone number is required for mobile money payment');
  }
  
  if (purchase.payment_method === 'card' && !purchase.payment_details?.card_token) {
    errors.push('Card token is required for card payment');
  }
  
  if (purchase.payment_method === 'bank_transfer' && !purchase.payment_details?.bank_account) {
    errors.push('Bank account is required for bank transfer');
  }
  
  return errors;
}

// Check if ticket can be refunded
export function canRefundTicket(ticket: Ticket): boolean {
  if (ticket.status !== 'active') return false;
  
  // Check if event is more than 24 hours away
  const eventDate = new Date(ticket.event?.date || '');
  const now = new Date();
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursUntilEvent > 24;
}

// Check if ticket can be transferred
export function canTransferTicket(ticket: Ticket): boolean {
  return ticket.status === 'active';
}

// Generate ticket number
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${timestamp}-${random}`.toUpperCase();
}

// Get ticket status color
export function getTicketStatusColor(status: Ticket['status']): string {
  switch (status) {
    case 'active': return '#10B981'; // green
    case 'used': return '#6B7280'; // gray
    case 'refunded': return '#EF4444'; // red
    case 'expired': return '#F59E0B'; // yellow
    case 'cancelled': return '#DC2626'; // red
    default: return '#6B7280'; // gray
  }
}

// Get ticket status text
export function getTicketStatusText(status: Ticket['status']): string {
  switch (status) {
    case 'active': return 'Active';
    case 'used': return 'Used';
    case 'refunded': return 'Refunded';
    case 'expired': return 'Expired';
    case 'cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
}

// Format ticket price
export function formatTicketPrice(price: number, currency: 'RWF' | 'USD' = 'RWF'): string {
  const formatter = new Intl.NumberFormat(currency === 'RWF' ? 'rw-RW' : 'en-US', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(price);
}

// Get ticket purchase summary
export async function getTicketPurchaseSummary(purchaseId: string) {
  return apiGet<{
    purchase_id: string;
    purchase_date: string;
    total_amount: number;
    currency: 'RWF' | 'USD';
    ticket_count: number;
    payment_status: 'pending' | 'completed' | 'failed';
    payment_method: string;
    event_title: string;
    event_date: string;
    venue_name: string;
    tickets: Ticket[];
  }>(`/api/tickets/purchases/${purchaseId}/summary`);
}

// Mobile-optimized ticket purchase with seat selection
export async function purchaseTicketsMobile(purchaseData: TicketPurchaseRequest & {
  selected_seats?: string[];
  payment_confirm?: boolean;
}) {
  return apiPost<TicketPurchaseResponse>("/api/tickets/purchase/mobile", purchaseData);
}

// Get available seats for mobile selection
export async function getAvailableSeatsMobile(categoryId: string, eventId: string) {
  return apiGet<{
    category_id: string;
    event_id: string;
    available_seats: Seat[];
    seat_map: {
      section_id: string;
      section_name: string;
      rows: number;
      columns: number;
      seats: {
        [seatId: string]: {
          id: string;
          seat_number: string;
          row: string;
          column: string;
          is_available: boolean;
          is_blocked: boolean;
          price: number;
          seat_type: string;
        };
      };
    };
    pricing: {
      base_price: number;
      currency: 'RWF' | 'USD';
      seat_type_modifiers: {
        [seatType: string]: number;
      };
    };
  }>(`/api/tickets/categories/${categoryId}/seats/mobile?event_id=${eventId}`);
}

// Hold seats temporarily during purchase process
export async function holdSeatsMobile(seatIds: string[], categoryId: string, duration: number = 15) {
  return apiPost<{
    hold_id: string;
    expires_at: string;
    held_seats: string[];
    total_price: number;
    currency: 'RWF' | 'USD';
  }>("/api/tickets/seats/hold", {
    seat_ids: seatIds,
    category_id: categoryId,
    duration_minutes: duration
  });
}

// Release held seats
export async function releaseSeatsMobile(holdId: string) {
  return apiPost<{ success: boolean; message: string }>("/api/tickets/seats/release", {
    hold_id: holdId
  });
}

// Get user's upcoming tickets for mobile
export async function getUpcomingTicketsMobile(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    mobile_optimized: 'true'
  });
  
  return apiGet<PaginatedResponse<Ticket>>(`/api/tickets/upcoming/mobile?${params.toString()}`);
}

// Get ticket QR code for mobile display
export async function getTicketQRCodeMobile(ticketId: string) {
  return apiGet<{
    qr_code: string;
    qr_code_url: string;
    ticket_details: {
      ticket_number: string;
      event_title: string;
      event_date: string;
      venue_name: string;
      section_name: string;
      seat_number?: string;
      holder_name: string;
    };
    download_options: {
      pdf_url: string;
      image_url: string;
    };
  }>(`/api/tickets/${ticketId}/qr-code/mobile`);
}

// Validate ticket for entry (mobile app)
export async function validateTicketForEntryMobile(qrCode: string, eventId: string) {
  return apiPost<{
    valid: boolean;
    ticket?: Ticket;
    message: string;
    entry_details?: {
      entry_time: string;
      gate_number?: string;
      section_name: string;
      seat_number?: string;
    };
  }>("/api/tickets/validate/entry", {
    qr_code: qrCode,
    event_id: eventId
  });
}

// Get ticket purchase summary for mobile
export async function getTicketPurchaseSummaryMobile(purchaseId: string) {
  return apiGet<{
    purchase_id: string;
    purchase_date: string;
    total_amount: number;
    currency: 'RWF' | 'USD';
    ticket_count: number;
    payment_status: 'pending' | 'completed' | 'failed';
    payment_method: string;
    event_title: string;
    event_date: string;
    venue_name: string;
    tickets: Ticket[];
    download_options: {
      receipt_url: string;
      tickets_pdf_url: string;
    };
  }>(`/api/tickets/purchases/${purchaseId}/summary/mobile`);
}
