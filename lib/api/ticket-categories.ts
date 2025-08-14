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



// Get ticket category by ID
export async function getTicketCategoryById(categoryId: string) {
  return apiGet<TicketCategory>(`/api/ticket-categories/${categoryId}`);
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
