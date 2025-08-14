import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/config/api";
import {
    ApiResponse,
    Event,
    EventAnalytics,
    EventCategory,
    EventSearchFilters,
    PaginatedResponse
} from "@/types/ticketing";

// Get all events with optional filters
export async function getEvents(filters?: EventSearchFilters, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  if (filters?.venue_id) params.append('venue_id', filters.venue_id);
  if (filters?.price_min) params.append('price_min', filters.price_min.toString());
  if (filters?.price_max) params.append('price_max', filters.price_max.toString());
  if (filters?.search) params.append('search', filters.search);
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return apiGet<PaginatedResponse<Event>>(`/api/events?${params.toString()}`);
}

// Get event by ID
export async function getEventById(eventId: string) {
  return apiGet<Event>(`/api/events/${eventId}`);
}

// Get upcoming events
export async function getUpcomingEvents(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/upcoming?${params.toString()}`);
}

// Get events by category
export async function getEventsByCategory(category: EventCategory, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/category/${category}?${params.toString()}`);
}

// Get events by venue
export async function getEventsByVenue(venueId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/venues/${venueId}/events?${params.toString()}`);
}

// Search events
export async function searchEvents(query: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/search?${params.toString()}`);
}

// Get event analytics (Admin only)
export async function getEventAnalytics(eventId: string, dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<EventAnalytics>(`/api/events/${eventId}/analytics?${params.toString()}`);
}

// Get popular events
export async function getPopularEvents(limit: number = 10) {
  return apiGet<Event[]>(`/api/events/popular?limit=${limit}`);
}

// Get events by date range
export async function getEventsByDateRange(dateFrom: string, dateTo: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    date_from: dateFrom,
    date_to: dateTo,
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/date-range?${params.toString()}`);
}

// Get events by price range
export async function getEventsByPriceRange(minPrice: number, maxPrice: number, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    min_price: minPrice.toString(),
    max_price: maxPrice.toString(),
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/price-range?${params.toString()}`);
}

// Get featured events
export async function getFeaturedEvents(limit: number = 5) {
  return apiGet<Event[]>(`/api/events/featured?limit=${limit}`);
}

// Get event recommendations for user
export async function getEventRecommendations(userId: string, limit: number = 10) {
  const params = new URLSearchParams({
    limit: limit.toString()
  });
  
  return apiGet<Event[]>(`/api/events/recommendations/${userId}?${params.toString()}`);
}

// Validate event data
export function validateEventData(data: any): string[] {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Event title must be at least 3 characters long');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Event description must be at least 10 characters long');
  }
  
  if (!data.date) {
    errors.push('Event date is required');
  } else {
    const eventDate = new Date(data.date);
    const now = new Date();
    if (eventDate <= now) {
      errors.push('Event date must be in the future');
    }
  }
  
  if (!data.start_time) {
    errors.push('Event start time is required');
  }
  
  if (!data.venue_id) {
    errors.push('Venue ID is required');
  }
  
  if (!data.category || !['music', 'sports', 'business', 'tech', 'art', 'culture', 'film', 'comedy', 'other'].includes(data.category)) {
    errors.push('Valid event category is required');
  }
  
  if (data.max_tickets_per_user && (data.max_tickets_per_user < 1 || data.max_tickets_per_user > 50)) {
    errors.push('Max tickets per user must be between 1 and 50');
  }
  
  return errors;
}
