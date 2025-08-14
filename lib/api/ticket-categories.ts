import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/config/api";
import {
    ApiResponse,
    CreateTicketCategoryRequest,
    PaginatedResponse,
    TicketCategory,
    UpdateTicketCategoryRequest
} from "@/types/ticketing";

// Get all ticket categories for an event
export async function getTicketCategoriesByEvent(eventId: string) {
  return apiGet<TicketCategory[]>(`/api/events/${eventId}/ticket-categories`);
}

// Get ticket category by ID
export async function getTicketCategoryById(categoryId: string) {
  return apiGet<TicketCategory>(`/api/ticket-categories/${categoryId}`);
}

// Create new ticket category (Admin only)
export async function createTicketCategory(categoryData: CreateTicketCategoryRequest) {
  return apiPost<TicketCategory>("/api/ticket-categories", categoryData);
}

// Update ticket category (Admin only)
export async function updateTicketCategory(categoryId: string, categoryData: UpdateTicketCategoryRequest) {
  return apiPut<TicketCategory>(`/api/ticket-categories/${categoryId}`, categoryData);
}

// Patch ticket category (Admin only) - for partial updates
export async function patchTicketCategory(categoryId: string, categoryData: Partial<UpdateTicketCategoryRequest>) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}`, categoryData);
}

// Delete ticket category (Admin only)
export async function deleteTicketCategory(categoryId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/ticket-categories/${categoryId}`);
}

// Get ticket categories by section
export async function getTicketCategoriesBySection(sectionId: string) {
  return apiGet<TicketCategory[]>(`/api/sections/${sectionId}/ticket-categories`);
}

// Get ticket categories by admin (Admin only)
export async function getTicketCategoriesByAdmin(adminId: string, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<TicketCategory>>(`/api/ticket-categories/admin/${adminId}?${params.toString()}`);
}

// Get active ticket categories for an event
export async function getActiveTicketCategoriesByEvent(eventId: string) {
  return apiGet<TicketCategory[]>(`/api/events/${eventId}/ticket-categories/active`);
}

// Activate ticket category (Admin only)
export async function activateTicketCategory(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/activate`, { is_active: true });
}

// Deactivate ticket category (Admin only)
export async function deactivateTicketCategory(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/deactivate`, { is_active: false });
}

// Update ticket category price (Admin only)
export async function updateTicketCategoryPrice(categoryId: string, price: number, currency: 'RWF' | 'USD' = 'RWF') {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/price`, { 
    price, 
    currency 
  });
}

// Add early bird discount to ticket category (Admin only)
export async function addEarlyBirdDiscount(
  categoryId: string, 
  percentage: number, 
  validUntil: string
) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/early-bird`, {
    early_bird_discount: {
      percentage,
      valid_until: validUntil
    }
  });
}

// Remove early bird discount from ticket category (Admin only)
export async function removeEarlyBirdDiscount(categoryId: string) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/early-bird`, {
    early_bird_discount: null
  });
}

// Get ticket category statistics
export async function getTicketCategoryStats(categoryId: string) {
  return apiGet<{
    total_tickets: number;
    sold_tickets: number;
    available_tickets: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    average_price: number;
    sales_percentage: number;
  }>(`/api/ticket-categories/${categoryId}/stats`);
}

// Bulk create ticket categories (Admin only)
export async function bulkCreateTicketCategories(eventId: string, categories: CreateTicketCategoryRequest[]) {
  return apiPost<TicketCategory[]>(`/api/events/${eventId}/ticket-categories/bulk`, { categories });
}

// Copy ticket category pricing from another event (Admin only)
export async function copyTicketCategoryPricing(sourceEventId: string, targetEventId: string) {
  return apiPost<{ message: string }>(`/api/events/${targetEventId}/ticket-categories/copy-pricing`, {
    source_event_id: sourceEventId
  });
}

// Get ticket categories with availability
export async function getTicketCategoriesWithAvailability(eventId: string) {
  return apiGet<(TicketCategory & { available_quantity: number; sold_quantity: number })[]>(
    `/api/events/${eventId}/ticket-categories/with-availability`
  );
}

// Get ticket categories by price range
export async function getTicketCategoriesByPriceRange(eventId: string, minPrice: number, maxPrice: number) {
  const params = new URLSearchParams({
    min_price: minPrice.toString(),
    max_price: maxPrice.toString()
  });
  
  return apiGet<TicketCategory[]>(`/api/events/${eventId}/ticket-categories/price-range?${params.toString()}`);
}

// Get cheapest ticket category for an event
export async function getCheapestTicketCategory(eventId: string) {
  return apiGet<TicketCategory>(`/api/events/${eventId}/ticket-categories/cheapest`);
}

// Get most expensive ticket category for an event
export async function getMostExpensiveTicketCategory(eventId: string) {
  return apiGet<TicketCategory>(`/api/events/${eventId}/ticket-categories/most-expensive`);
}

// Validate ticket category data before creation/update
export function validateTicketCategoryData(data: CreateTicketCategoryRequest | UpdateTicketCategoryRequest): string[] {
  const errors: string[] = [];
  
  if ('name' in data && (!data.name || data.name.trim().length < 2)) {
    errors.push('Ticket category name must be at least 2 characters long');
  }
  
  if ('price' in data && (data.price < 0 || data.price > 1000000)) {
    errors.push('Price must be between 0 and 1,000,000');
  }
  
  if ('currency' in data && data.currency && !['RWF', 'USD'].includes(data.currency)) {
    errors.push('Currency must be either RWF or USD');
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
  
  // Validate early bird discount
  if ('early_bird_discount' in data && data.early_bird_discount) {
    if (data.early_bird_discount.percentage < 1 || data.early_bird_discount.percentage > 100) {
      errors.push('Early bird discount percentage must be between 1 and 100');
    }
    
    const validUntil = new Date(data.early_bird_discount.valid_until);
    const now = new Date();
    
    if (validUntil <= now) {
      errors.push('Early bird discount valid until date must be in the future');
    }
  }
  
  return errors;
}

// Check if early bird discount is still valid
export function isEarlyBirdDiscountValid(category: TicketCategory): boolean {
  if (!category.early_bird_discount) return false;
  
  const validUntil = new Date(category.early_bird_discount.valid_until);
  const now = new Date();
  
  return validUntil > now;
}

// Calculate discounted price
export function calculateDiscountedPrice(category: TicketCategory): number {
  if (!isEarlyBirdDiscountValid(category)) {
    return category.price;
  }
  
  const discountPercentage = category.early_bird_discount!.percentage;
  const discountAmount = (category.price * discountPercentage) / 100;
  
  return Math.max(0, category.price - discountAmount);
}

// Get ticket categories with pricing tiers
export async function getTicketCategoriesWithPricingTiers(eventId: string) {
  return apiGet<{
    tier: string;
    categories: TicketCategory[];
    price_range: {
      min: number;
      max: number;
      currency: 'RWF' | 'USD';
    };
  }[]>(`/api/events/${eventId}/ticket-categories/pricing-tiers`);
}

// Get ticket categories by section for an event
export async function getTicketCategoriesBySectionForEvent(eventId: string, sectionId: string) {
  return apiGet<TicketCategory[]>(`/api/events/${eventId}/sections/${sectionId}/ticket-categories`);
}

// Update ticket category capacity (Admin only)
export async function updateTicketCategoryCapacity(categoryId: string, maxQuantity: number) {
  return apiPatch<TicketCategory>(`/api/ticket-categories/${categoryId}/capacity`, {
    max_quantity: maxQuantity
  });
}

// Get ticket category sales analytics (Admin only)
export async function getTicketCategorySalesAnalytics(categoryId: string, dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<{
    category_id: string;
    category_name: string;
    total_sales: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    daily_sales: {
      date: string;
      tickets_sold: number;
      revenue: number;
    }[];
    average_tickets_per_purchase: number;
  }>(`/api/ticket-categories/${categoryId}/sales-analytics?${params.toString()}`);
}
