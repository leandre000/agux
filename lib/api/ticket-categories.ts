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

// Get ticket categories for mobile display
export async function getTicketCategoriesMobile(eventId: string) {
  return apiGet<{
    event_id: string;
    event_title: string;
    categories: (TicketCategory & {
      section_info: {
        section_id: string;
        section_name: string;
        section_description?: string;
        color_code?: string;
      };
      availability: {
        available_quantity: number;
        sold_quantity: number;
        reserved_quantity: number;
        availability_percentage: number;
      };
      pricing_details: {
        base_price: number;
        currency: 'RWF' | 'USD';
        early_bird_discount?: {
          percentage: number;
          valid_until: string;
          savings_amount: number;
        };
        bulk_discounts?: {
          min_quantity: number;
          percentage: number;
          savings_amount: number;
        }[];
        seat_type_modifiers: {
          [seatType: string]: number;
        };
      };
      features: {
        includes_amenities: string[];
        exclusive_benefits: string[];
        special_access: string[];
      };
    })[];
    purchase_options: {
      max_tickets_per_user: number;
      allow_partial_purchase: boolean;
      require_full_payment: boolean;
      payment_methods: string[];
      refund_policy: string;
    };
  }>(`/api/events/${eventId}/ticket-categories/mobile`);
}

// Get ticket category details for mobile purchase
export async function getTicketCategoryDetailsMobile(categoryId: string, eventId: string) {
  return apiGet<{
    category_id: string;
    category_name: string;
    description?: string;
    event_id: string;
    event_title: string;
    event_date: string;
    venue_name: string;
    section_info: {
      section_id: string;
      section_name: string;
      section_description?: string;
      capacity: number;
      color_code?: string;
    };
    pricing: {
      base_price: number;
      currency: 'RWF' | 'USD';
      final_price: number;
      early_bird_discount?: {
        percentage: number;
        valid_until: string;
        savings_amount: number;
      };
      bulk_discounts?: {
        min_quantity: number;
        percentage: number;
        savings_amount: number;
      }[];
    };
    availability: {
      total_quantity: number;
      available_quantity: number;
      sold_quantity: number;
      reserved_quantity: number;
      availability_percentage: number;
      low_availability_warning?: boolean;
    };
    features: {
      includes_amenities: string[];
      exclusive_benefits: string[];
      special_access: string[];
      restrictions: string[];
    };
    purchase_terms: {
      max_tickets_per_user: number;
      min_tickets_per_purchase: number;
      allow_partial_purchase: boolean;
      require_full_payment: boolean;
      payment_methods: string[];
      refund_policy: string;
      cancellation_policy: string;
    };
  }>(`/api/ticket-categories/${categoryId}/mobile?event_id=${eventId}`);
}
