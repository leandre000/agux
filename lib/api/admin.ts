import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/config/api";
import {
    Admin,
    ApiResponse,
    Event,
    PaginatedResponse,
    Seat,
    Section,
    Ticket,
    TicketCategory,
    Venue
} from "@/types/ticketing";

// Admin Management
export async function getAdminProfile() {
  return apiGet<Admin>("/api/admin/profile");
}

export async function updateAdminProfile(profileData: Partial<Admin>) {
  return apiPut<Admin>("/api/admin/profile", profileData);
}

export async function getAdminStats() {
  return apiGet<{
    total_venues: number;
    total_events: number;
    total_tickets_sold: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    active_events: number;
    upcoming_events: number;
    completed_events: number;
  }>("/api/admin/stats");
}

// Venue Management (Admin only)
export async function getAdminVenues(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/admin/venues?${params.toString()}`);
}

export async function createAdminVenue(venueData: any) {
  return apiPost<Venue>("/api/admin/venues", venueData);
}

export async function updateAdminVenue(venueId: string, venueData: any) {
  return apiPut<Venue>(`/api/admin/venues/${venueId}`, venueData);
}

export async function deleteAdminVenue(venueId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/venues/${venueId}`);
}

// Event Management (Admin only)
export async function getAdminEvents(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/admin/events?${params.toString()}`);
}

export async function createAdminEvent(eventData: any) {
  return apiPost<Event>("/api/admin/events", eventData);
}

export async function updateAdminEvent(eventId: string, eventData: any) {
  return apiPut<Event>(`/api/admin/events/${eventId}`, eventData);
}

export async function deleteAdminEvent(eventId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/events/${eventId}`);
}

// Section Management (Admin only)
export async function getAdminSections(venueId?: string, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (venueId) params.append('venue_id', venueId);
  
  return apiGet<PaginatedResponse<Section>>(`/api/admin/sections?${params.toString()}`);
}

export async function createAdminSection(sectionData: any) {
  return apiPost<Section>("/api/admin/sections", sectionData);
}

export async function updateAdminSection(sectionId: string, sectionData: any) {
  return apiPut<Section>(`/api/admin/sections/${sectionId}`, sectionData);
}

export async function deleteAdminSection(sectionId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/sections/${sectionId}`);
}

// Seat Management (Admin only)
export async function getAdminSeats(sectionId?: string, page: number = 1, limit: number = 100) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (sectionId) params.append('section_id', sectionId);
  
  return apiGet<PaginatedResponse<Seat>>(`/api/admin/seats?${params.toString()}`);
}

export async function createAdminSeat(seatData: any) {
  return apiPost<Seat>("/api/admin/seats", seatData);
}

export async function createAdminBulkSeats(bulkData: any) {
  return apiPost<Seat[]>("/api/admin/seats/bulk", bulkData);
}

export async function updateAdminSeat(seatId: string, seatData: any) {
  return apiPut<Seat>(`/api/admin/seats/${seatId}`, seatData);
}

export async function deleteAdminSeat(seatId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/seats/${seatId}`);
}

// Ticket Category Management (Admin only)
export async function getAdminTicketCategories(eventId?: string, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<PaginatedResponse<TicketCategory>>(`/api/admin/ticket-categories?${params.toString()}`);
}

export async function createAdminTicketCategory(categoryData: any) {
  return apiPost<TicketCategory>("/api/admin/ticket-categories", categoryData);
}

export async function updateAdminTicketCategory(categoryId: string, categoryData: any) {
  return apiPut<TicketCategory>(`/api/admin/ticket-categories/${categoryId}`, categoryData);
}

export async function deleteAdminTicketCategory(categoryId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/ticket-categories/${categoryId}`);
}

// Ticket Management (Admin only)
export async function getAdminTickets(filters?: {
  event_id?: string;
  user_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (filters?.event_id) params.append('event_id', filters.event_id);
  if (filters?.user_id) params.append('user_id', filters.user_id);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  
  return apiGet<PaginatedResponse<Ticket>>(`/api/admin/tickets?${params.toString()}`);
}

export async function updateAdminTicket(ticketId: string, ticketData: any) {
  return apiPut<Ticket>(`/api/admin/tickets/${ticketId}`, ticketData);
}

export async function deleteAdminTicket(ticketId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/admin/tickets/${ticketId}`);
}

// Bulk Operations (Admin only)
export async function bulkCreateVenues(venues: any[]) {
  return apiPost<Venue[]>("/api/admin/venues/bulk", { venues });
}

export async function bulkCreateEvents(events: any[]) {
  return apiPost<Event[]>("/api/admin/events/bulk", { events });
}

export async function bulkCreateSections(sections: any[]) {
  return apiPost<Section[]>("/api/admin/sections/bulk", { sections });
}

export async function bulkCreateSeats(seats: any[]) {
  return apiPost<Seat[]>("/api/admin/seats/bulk", { seats });
}

export async function bulkCreateTicketCategories(categories: any[]) {
  return apiPost<TicketCategory[]>("/api/admin/ticket-categories/bulk", { categories });
}

// Analytics and Reports (Admin only)
export async function getAdminDashboardAnalytics(dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{
    revenue_analytics: {
      total_revenue: number;
      currency: 'RWF' | 'USD';
      daily_revenue: { date: string; revenue: number }[];
      monthly_revenue: { month: string; revenue: number }[];
    };
    ticket_analytics: {
      total_tickets_sold: number;
      tickets_by_status: { status: string; count: number }[];
      tickets_by_event: { event_id: string; event_title: string; count: number }[];
    };
    event_analytics: {
      total_events: number;
      events_by_status: { status: string; count: number }[];
      events_by_category: { category: string; count: number }[];
    };
    venue_analytics: {
      total_venues: number;
      venues_by_city: { city: string; count: number }[];
      popular_venues: { venue_id: string; venue_name: string; event_count: number }[];
    };
  }>(`/api/admin/analytics/dashboard?${params.toString()}`);
}

export async function getAdminRevenueReport(dateFrom?: string, dateTo?: string, format: 'csv' | 'excel' = 'csv') {
  const params = new URLSearchParams({ format });
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{ download_url: string }>(`/api/admin/reports/revenue?${params.toString()}`);
}

export async function getAdminTicketReport(eventId?: string, dateFrom?: string, dateTo?: string, format: 'csv' | 'excel' = 'csv') {
  const params = new URLSearchParams({ format });
  if (eventId) params.append('event_id', eventId);
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{ download_url: string }>(`/api/admin/reports/tickets?${params.toString()}`);
}

export async function getAdminEventReport(dateFrom?: string, dateTo?: string, format: 'csv' | 'excel' = 'csv') {
  const params = new URLSearchParams({ format });
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{ download_url: string }>(`/api/admin/reports/events?${params.toString()}`);
}

// System Management (Admin only)
export async function getSystemHealth() {
  return apiGet<{
    status: 'healthy' | 'warning' | 'critical';
    services: {
      database: { status: string; response_time: number };
      cache: { status: string; response_time: number };
      storage: { status: string; response_time: number };
      email: { status: string; response_time: number };
      sms: { status: string; response_time: number };
    };
    uptime: number;
    memory_usage: number;
    cpu_usage: number;
  }>("/api/admin/system/health");
}

export async function getSystemLogs(page: number = 1, limit: number = 100, level?: 'info' | 'warning' | 'error') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (level) params.append('level', level);
  
  return apiGet<PaginatedResponse<{
    id: string;
    timestamp: string;
    level: string;
    message: string;
    context: any;
  }>>(`/api/admin/system/logs?${params.toString()}`);
}

// User Management (Admin only)
export async function getAdminUsers(page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<any>>(`/api/admin/users?${params.toString()}`);
}

export async function updateAdminUser(userId: string, userData: any) {
  return apiPut<any>(`/api/admin/users/${userId}`, userData);
}

export async function deactivateAdminUser(userId: string) {
  return apiPatch<any>(`/api/admin/users/${userId}/deactivate`, { is_active: false });
}

export async function activateAdminUser(userId: string) {
  return apiPatch<any>(`/api/admin/users/${userId}/activate`, { is_active: true });
}

// Backup and Restore (Admin only)
export async function createSystemBackup() {
  return apiPost<{ backup_id: string; download_url: string }>("/api/admin/system/backup");
}

export async function getSystemBackups() {
  return apiGet<{
    backup_id: string;
    created_at: string;
    size: number;
    download_url: string;
  }[]>("/api/admin/system/backups");
}

export async function restoreSystemBackup(backupId: string) {
  return apiPost<{ message: string }>(`/api/admin/system/restore/${backupId}`);
}

// Settings Management (Admin only)
export async function getAdminSettings() {
  return apiGet<{
    general: {
      site_name: string;
      site_description: string;
      contact_email: string;
      contact_phone: string;
    };
    payment: {
      currency: 'RWF' | 'USD';
      payment_methods: string[];
      processing_fee_percentage: number;
    };
    notifications: {
      email_enabled: boolean;
      sms_enabled: boolean;
      push_enabled: boolean;
    };
    security: {
      max_login_attempts: number;
      session_timeout: number;
      require_2fa: boolean;
    };
  }>("/api/admin/settings");
}

export async function updateAdminSettings(settings: any) {
  return apiPut<{ message: string }>("/api/admin/settings", settings);
}
