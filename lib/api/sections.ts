import { apiGet } from "@/config/api";
import {
    Section,
    PaginatedResponse
} from "@/types/ticketing";

// Get sections by venue
export async function getSectionsByVenue(venueId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Section>>(`/api/venues/${venueId}/sections?${params.toString()}`);
}

// Get section by ID
export async function getSectionById(sectionId: string) {
  return apiGet<Section>(`/api/sections/${sectionId}`);
}

// Get sections by venue with availability
export async function getSectionsByVenueWithAvailability(venueId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<(Section & { available_seats: number; total_seats: number })[]>(`/api/venues/${venueId}/sections/availability?${params.toString()}`);
}

// Get section seat map
export async function getSectionSeatMap(sectionId: string) {
  return apiGet<{
    section_id: string;
    section_name: string;
    rows: number;
    columns: number;
    row_labels: string[];
    column_labels: string[];
    seat_map: {
      [rowLabel: string]: {
        [columnLabel: string]: {
          seat_id: string;
          seat_number: string;
          is_available: boolean;
          is_blocked: boolean;
          seat_type: string;
          price: number;
        };
      };
    };
  }>(`/api/sections/${sectionId}/seat-map`);
}

// Get section statistics
export async function getSectionStats(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{
    section_id: string;
    section_name: string;
    total_seats: number;
    available_seats: number;
    occupied_seats: number;
    blocked_seats: number;
    availability_percentage: number;
    revenue_potential: number;
    currency: 'RWF' | 'USD';
  }>(`/api/sections/${sectionId}/stats?${params.toString()}`);
}

// Get sections by type
export async function getSectionsByType(venueId: string, sectionType: string) {
  return apiGet<Section[]>(`/api/venues/${venueId}/sections/type/${sectionType}`);
}

// Get premium sections (VIP, etc.)
export async function getPremiumSections(venueId: string) {
  return apiGet<Section[]>(`/api/venues/${venueId}/sections/premium`);
}

// Get accessible sections (wheelchair accessible)
export async function getAccessibleSections(venueId: string) {
  return apiGet<Section[]>(`/api/venues/${venueId}/sections/accessible`);
}

// Search sections by name
export async function searchSections(venueId: string, query: string) {
  const params = new URLSearchParams({
    q: query
  });
  
  return apiGet<Section[]>(`/api/venues/${venueId}/sections/search?${params.toString()}`);
}

// Get section pricing information
export async function getSectionPricing(sectionId: string) {
  return apiGet<{
    section_id: string;
    section_name: string;
    base_price: number;
    currency: 'RWF' | 'USD';
    price_tiers: {
      seat_type: string;
      price_modifier: number;
      description: string;
    }[];
  }>(`/api/sections/${sectionId}/pricing`);
}

// Get section seat map optimized for mobile
export async function getSectionSeatMapMobile(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{
    section_id: string;
    section_name: string;
    rows: number;
    columns: number;
    row_labels: string[];
    column_labels: string[];
    seat_map: {
      [rowLabel: string]: {
        [columnLabel: string]: {
          seat_id: string;
          seat_number: string;
          is_available: boolean;
          is_blocked: boolean;
          seat_type: string;
          price: number;
          is_selected?: boolean;
          is_held?: boolean;
        };
      };
    };
    mobile_optimized: boolean;
    touch_friendly: boolean;
    zoom_levels: number[];
    legend: {
      available: string;
      occupied: string;
      blocked: string;
      selected: string;
      held: string;
      vip: string;
      wheelchair: string;
    };
  }>(`/api/sections/${sectionId}/seat-map/mobile?${params.toString()}`);
}

// Get section availability for mobile
export async function getSectionAvailabilityMobile(sectionId: string, eventId: string) {
  return apiGet<{
    section_id: string;
    section_name: string;
    event_id: string;
    event_title: string;
    total_seats: number;
    available_seats: number;
    occupied_seats: number;
    blocked_seats: number;
    reserved_seats: number;
    availability_percentage: number;
    seat_types: {
      type: string;
      count: number;
      price_range: {
        min: number;
        max: number;
      };
    }[];
    pricing_summary: {
      base_price: number;
      currency: 'RWF' | 'USD';
      discounts: {
        early_bird?: {
          percentage: number;
          valid_until: string;
        };
        bulk?: {
          min_quantity: number;
          percentage: number;
        };
        group?: {
          min_quantity: number;
          percentage: number;
        };
      };
    };
  }>(`/api/sections/${sectionId}/availability/mobile?event_id=${eventId}`);
}

// Get sections by venue for mobile display
export async function getVenueSectionsForMobile(venueId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{
    venue_id: string;
    venue_name: string;
    sections: (Section & {
      availability: {
        total_seats: number;
        available_seats: number;
        occupied_seats: number;
        blocked_seats: number;
        availability_percentage: number;
      };
      pricing: {
        base_price: number;
        currency: 'RWF' | 'USD';
        price_range: {
          min: number;
          max: number;
        };
        seat_type_modifiers: {
          [seatType: string]: number;
        };
      };
      features: {
        wheelchair_accessible: boolean;
        vip_experience: boolean;
        premium_view: boolean;
        exclusive_amenities: string[];
      };
    })[];
  }>(`/api/venues/${venueId}/sections/mobile?${params.toString()}`);
}
