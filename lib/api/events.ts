import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/config/api";
import {
    ApiResponse,
    CreateEventRequest,
    Event,
    EventAnalytics,
    EventCategory,
    EventSearchFilters,
    PaginatedResponse,
    UpdateEventRequest
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

// Create new event (Admin only)
export async function createEvent(eventData: CreateEventRequest) {
  return apiPost<Event>("/api/events", eventData);
}

// Update event (Admin only)
export async function updateEvent(eventId: string, eventData: UpdateEventRequest) {
  return apiPut<Event>(`/api/events/${eventId}`, eventData);
}

// Patch event (Admin only) - for partial updates
export async function patchEvent(eventId: string, eventData: Partial<UpdateEventRequest>) {
  return apiPatch<Event>(`/api/events/${eventId}`, eventData);
}

// Delete event (Admin only)
export async function deleteEvent(eventId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/events/${eventId}`);
}

// Get events by venue
export async function getEventsByVenue(venueId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/venues/${venueId}/events?${params.toString()}`);
}

// Get events by admin (Admin only)
export async function getEventsByAdmin(adminId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/admin/${adminId}?${params.toString()}`);
}

// Get upcoming events
export async function getUpcomingEvents(limit: number = 10) {
  return apiGet<Event[]>(`/api/events/upcoming?limit=${limit}`);
}

// Get featured events
export async function getFeaturedEvents(limit: number = 10) {
  return apiGet<Event[]>(`/api/events/featured?limit=${limit}`);
}

// Get events by category
export async function getEventsByCategory(category: EventCategory, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Event>>(`/api/events/category/${category}?${params.toString()}`);
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

// Publish event (Admin only)
export async function publishEvent(eventId: string) {
  return apiPatch<Event>(`/api/events/${eventId}/publish`, { status: 'published' });
}

// Unpublish event (Admin only)
export async function unpublishEvent(eventId: string) {
  return apiPatch<Event>(`/api/events/${eventId}/unpublish`, { status: 'draft' });
}

// Cancel event (Admin only)
export async function cancelEvent(eventId: string, reason?: string) {
  return apiPatch<Event>(`/api/events/${eventId}/cancel`, { 
    status: 'cancelled',
    cancellation_reason: reason
  });
}

// Complete event (Admin only)
export async function completeEvent(eventId: string) {
  return apiPatch<Event>(`/api/events/${eventId}/complete`, { status: 'completed' });
}

// Upload event image (Admin only)
export async function uploadEventImage(eventId: string, imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return apiPost<{ image_url: string }>(`/api/events/${eventId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Get event statistics
export async function getEventStats(eventId: string) {
  return apiGet<{
    total_tickets_sold: number;
    total_revenue: number;
    currency: 'RWF' | 'USD';
    available_tickets: number;
    sold_percentage: number;
    average_ticket_price: number;
  }>(`/api/events/${eventId}/stats`);
}

// Get popular events (based on ticket sales or views)
export async function getPopularEvents(limit: number = 10) {
  return apiGet<Event[]>(`/api/events/popular?limit=${limit}`);
}

// Get events happening today
export async function getTodayEvents() {
  return apiGet<Event[]>(`/api/events/today`);
}

// Get events happening this week
export async function getThisWeekEvents() {
  return apiGet<Event[]>(`/api/events/this-week`);
}

// Get events happening this month
export async function getThisMonthEvents() {
  return apiGet<Event[]>(`/api/events/this-month`);
}

// Validate event data before creation/update
export function validateEventData(data: CreateEventRequest | UpdateEventRequest): string[] {
  const errors: string[] = [];
  
  if ('title' in data && (!data.title || data.title.trim().length < 3)) {
    errors.push('Event title must be at least 3 characters long');
  }
  
  if ('description' in data && (!data.description || data.description.trim().length < 10)) {
    errors.push('Event description must be at least 10 characters long');
  }
  
  if ('date' in data) {
    const eventDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      errors.push('Event date cannot be in the past');
    }
  }
  
  if ('start_time' in data && !data.start_time) {
    errors.push('Start time is required');
  }
  
  if ('venue_id' in data && !data.venue_id) {
    errors.push('Venue ID is required');
  }
  
  if ('category' in data && !data.category) {
    errors.push('Event category is required');
  }
  
  if ('max_tickets_per_user' in data && data.max_tickets_per_user !== undefined) {
    if (data.max_tickets_per_user < 1 || data.max_tickets_per_user > 50) {
      errors.push('Max tickets per user must be between 1 and 50');
    }
  }
  
  // Validate artist lineup
  if ('artist_lineup' in data && data.artist_lineup) {
    if (!Array.isArray(data.artist_lineup)) {
      errors.push('Artist lineup must be an array');
    } else {
      data.artist_lineup.forEach((artist, index) => {
        if (!artist || artist.trim().length === 0) {
          errors.push(`Artist at index ${index} cannot be empty`);
        }
      });
    }
  }
  
  return errors;
}

// Check if event is sold out
export async function isEventSoldOut(eventId: string): Promise<boolean> {
  try {
    const stats = await getEventStats(eventId);
    return stats.available_tickets === 0;
  } catch {
    return false;
  }
}

// Get event categories
export async function getEventCategories() {
  return apiGet<{ category: EventCategory; count: number }[]>(`/api/events/categories`);
}

// Get events with ticket availability
export async function getEventsWithAvailability(page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    include_availability: 'true'
  });
  
  return apiGet<PaginatedResponse<Event & { available_tickets: number }>>(`/api/events?${params.toString()}`);
}
