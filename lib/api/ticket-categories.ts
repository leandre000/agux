import { apiGet, apiPost, apiPut, apiPatch } from "@/config/api";
import {
    TicketCategory,
    CreateTicketCategoryRequest,
    UpdateTicketCategoryRequest,
    PaginatedResponse
} from "@/types/ticketing";

// Get ticket categories by event
export async function getTicketCategoriesByEvent(eventId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<TicketCategory>>(`/api/events/${eventId}/ticket-categories?${params.toString()}`);
}

// Get active ticket categories by event
export async function getActiveTicketCategoriesByEvent(eventId: string) {
  return apiGet<TicketCategory[]>(`/api/events/${eventId}/ticket-categories/active`);
}

// Get ticket categories with availability
export async function getTicketCategoriesWithAvailability(eventId: string) {
  return apiGet<(TicketCategory & { available_quantity: number })[]>(`/api/events/${eventId}/ticket-categories/availability`);
}

// Create ticket category (Admin only)
export async function createTicketCategory(categoryData: CreateTicketCategoryRequest) {
  return apiPost<TicketCategory>("/api/ticket-categories", categoryData);
}

// Update ticket category (Admin only)
export async function updateTicketCategory(categoryId: string, categoryData: UpdateTicketCategoryRequest) {
  return apiPut<TicketCategory>(`/api/ticket-categories/${categoryId}`, categoryData);
}

// Update ticket category price (Admin only)
export async function updateTicketCategoryPrice(categoryId: string, price: number, currency: 'RWF' | 'USD' = 'RWF') {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/price`, { price, currency });
}

// Activate ticket category (Admin only)
export async function activateTicketCategory(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/activate`);
}

// Deactivate ticket category (Admin only)
export async function deactivateTicketCategory(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/deactivate`);
}

// Add early bird discount (Admin only)
export async function addEarlyBirdDiscount(categoryId: string, percentage: number, validUntil: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/early-bird`, {
    percentage,
    valid_until: validUntil
  });
}

// Remove early bird discount (Admin only)
export async function removeEarlyBirdDiscount(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/remove-early-bird`);
}

// Get ticket category by ID
export async function getTicketCategoryById(categoryId: string) {
  return apiGet<TicketCategory>(`/api/ticket-categories/${categoryId}`);
}

// Get all ticket categories (Admin only)
export async function getAllTicketCategories(page: number = 1, limit: number = 50, filters?: {
  event_id?: string;
  section_id?: string;
  status?: 'active' | 'inactive';
  price_min?: number;
  price_max?: number;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (filters?.event_id) params.append('event_id', filters.event_id);
  if (filters?.section_id) params.append('section_id', filters.section_id);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.price_min) params.append('price_min', filters.price_min.toString());
  if (filters?.price_max) params.append('price_max', filters.price_max.toString());
  
  return apiGet<PaginatedResponse<TicketCategory>>(`/api/ticket-categories?${params.toString()}`);
}

// Bulk create ticket categories (Admin only)
export async function bulkCreateTicketCategories(categories: CreateTicketCategoryRequest[]) {
  return apiPost<TicketCategory[]>("/api/ticket-categories/bulk", { categories });
}

// Bulk update ticket categories (Admin only)
export async function bulkUpdateTicketCategories(updates: { id: string; data: UpdateTicketCategoryRequest }[]) {
  return apiPut<TicketCategory[]>("/api/ticket-categories/bulk", { updates });
}

// Get ticket category analytics (Admin only)
export async function getTicketCategoryAnalytics(categoryId: string, dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{
    category_id: string;
    total_tickets_sold: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    average_price: number;
    conversion_rate: number;
    daily_sales: {
      date: string;
      tickets_sold: number;
      revenue: number;
    }[];
  }>(`/api/ticket-categories/${categoryId}/analytics?${params.toString()}`);
}

// Validate ticket category data
export function validateTicketCategoryData(data: CreateTicketCategoryRequest | UpdateTicketCategoryRequest): string[] {
  const errors: string[] = [];
  
  if ('name' in data && (!data.name || data.name.trim().length < 2)) {
    errors.push('Category name must be at least 2 characters long');
  }
  
  if ('description' in data && (!data.description || data.description.trim().length < 5)) {
    errors.push('Category description must be at least 5 characters long');
  }
  
  if ('price' in data && (data.price < 0)) {
    errors.push('Price must be non-negative');
  }
  
  if ('currency' in data && !['RWF', 'USD'].includes(data.currency)) {
    errors.push('Currency must be RWF or USD');
  }
  
  if ('event_id' in data && !data.event_id) {
    errors.push('Event ID is required');
  }
  
  if ('section_id' in data && !data.section_id) {
    errors.push('Section ID is required');
  }
  
  if ('max_quantity_per_user' in data && data.max_quantity_per_user !== undefined) {
    if (data.max_quantity_per_user < 1 || data.max_quantity_per_user > 50) {
      errors.push('Max quantity per user must be between 1 and 50');
    }
  }
  
  return errors;
}

// Check if early bird discount is valid
export function isEarlyBirdDiscountValid(category: TicketCategory): boolean {
  if (!category.early_bird_discount) return false;
  
  const now = new Date();
  const validUntil = new Date(category.early_bird_discount.valid_until);
  
  return now < validUntil;
}

// Calculate discounted price
export function calculateDiscountedPrice(category: TicketCategory): number {
  if (!isEarlyBirdDiscountValid(category)) {
    return category.price;
  }
  
  const discountPercentage = category.early_bird_discount.percentage;
  const discountAmount = (category.price * discountPercentage) / 100;
  
  return Math.max(0, category.price - discountAmount);
}

// Get ticket category statistics
export async function getTicketCategoryStats(categoryId: string) {
  return apiGet<{
    category_id: string;
    total_available: number;
    total_sold: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    average_price: number;
    is_early_bird_active: boolean;
    early_bird_discount_percentage?: number;
    early_bird_valid_until?: string;
  }>(`/api/ticket-categories/${categoryId}/stats`);
}
