import { apiGet, apiPost } from "@/config/api";
import {
    Seat,
    CreateBulkSeatsRequest,
    PaginatedResponse
} from "@/types/ticketing";

// Get seats by section
export async function getSeatsBySection(sectionId: string, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Seat>>(`/api/sections/${sectionId}/seats?${params.toString()}`);
}

// Get seat availability for a section
export async function getSeatAvailability(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{
    total_seats: number;
    available_seats: number;
    occupied_seats: number;
    blocked_seats: number;
    availability_percentage: number;
  }>(`/api/sections/${sectionId}/seats/availability?${params.toString()}`);
}



// Get seat by ID
export async function getSeatById(seatId: string) {
  return apiGet<Seat>(`/api/seats/${seatId}`);
}

// Get available seats for a section
export async function getAvailableSeatsForSection(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/available?${params.toString()}`);
}

// Get occupied seats for a section
export async function getOccupiedSeatsForSection(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/occupied?${params.toString()}`);
}

// Get seats by type
export async function getSeatsByType(sectionId: string, seatType: string) {
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/type/${seatType}`);
}

// Get special seats (wheelchair accessible, etc.)
export async function getSpecialSeats(sectionId: string, specialType?: string) {
  const params = new URLSearchParams();
  if (specialType) params.append('type', specialType);
  
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/special?${params.toString()}`);
}

// Get seat map for a section
export async function getSeatMap(sectionId: string) {
  return apiGet<{
    section_id: string;
    rows: number;
    columns: number;
    row_labels: string[];
    column_labels: string[];
    seats: {
      [key: string]: {
        id: string;
        row: string;
        column: string;
        seat_number: string;
        status: 'available' | 'occupied' | 'blocked';
        seat_type: string;
        price_modifier: number;
        special_type?: string;
      };
    };
    blocked_seats: string[];
    special_seats: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
  }>(`/api/sections/${sectionId}/seat-map`);
}

// Get seat statistics for a section
export async function getSeatStats(sectionId: string) {
  return apiGet<{
    section_id: string;
    total_seats: number;
    available_seats: number;
    occupied_seats: number;
    blocked_seats: number;
    special_seats: number;
    seats_by_type: {
      [key: string]: number;
    };
    revenue_potential: number;
    currency: 'RWF' | 'USD';
  }>(`/api/sections/${sectionId}/seats/stats`);
}



// Generate seat numbers based on configuration
export function generateSeatNumbers(config: {
  rows: number;
  columns: number;
  row_labels: string[];
  column_labels: string[];
}): string[] {
  const seatNumbers: string[] = [];
  
  for (let i = 0; i < config.rows; i++) {
    for (let j = 0; j < config.columns; j++) {
      const rowLabel = config.row_labels[i] || String.fromCharCode(65 + i);
      const colLabel = config.column_labels[j] || String(j + 1);
      seatNumbers.push(`${rowLabel}${colLabel}`);
    }
  }
  
  return seatNumbers;
}

// Check if seat is available
export function isSeatAvailable(seat: Seat): boolean {
  return seat.is_available;
}

// Get seat price with modifier
export function getSeatPrice(basePrice: number, priceModifier: number): number {
  return Math.max(0, basePrice + priceModifier);
}

// Format seat number for display
export function formatSeatNumber(seatNumber: string): string {
  return seatNumber.toUpperCase();
}

// Get seat status color
export function getSeatStatusColor(isAvailable: boolean, isBlocked: boolean): string {
  if (isBlocked) return '#6B7280'; // gray
  if (isAvailable) return '#10B981'; // green
  return '#EF4444'; // red
}

// Get seat status text
export function getSeatStatusText(isAvailable: boolean, isBlocked: boolean): string {
  if (isBlocked) return 'Blocked';
  if (isAvailable) return 'Available';
  return 'Occupied';
}

// Get seats for mobile selection
export async function getSeatsForMobileSelection(sectionId: string, eventId: string, categoryId: string) {
  return apiGet<{
    section_id: string;
    event_id: string;
    category_id: string;
    seats: Seat[];
    selection_config: {
      max_seats_per_user: number;
      allow_mixed_seat_types: boolean;
      seat_holding_duration: number;
      selection_restrictions: string[];
    };
    pricing: {
      base_price: number;
      currency: 'RWF' | 'USD';
      seat_type_modifiers: {
        [seatType: string]: number;
      };
      bulk_discounts: {
        min_quantity: number;
        percentage: number;
      }[];
    };
  }>(`/api/sections/${sectionId}/seats/mobile-selection?event_id=${eventId}&category_id=${categoryId}`);
}

// Select seats for mobile purchase
export async function selectSeatsMobile(seatIds: string[], categoryId: string, eventId: string) {
  return apiPost<{
    selection_id: string;
    selected_seats: Seat[];
    total_price: number;
    currency: 'RWF' | 'USD';
    expires_at: string;
    seat_details: {
      seat_id: string;
      seat_number: string;
      row: string;
      column: string;
      seat_type: string;
      price: number;
    }[];
  }>("/api/seats/select/mobile", {
    seat_ids: seatIds,
    category_id: categoryId,
    event_id: eventId
  });
}

// Release selected seats
export async function releaseSelectedSeats(selectionId: string) {
  return apiPost<{ success: boolean; message: string }>("/api/seats/release-selection", {
    selection_id: selectionId
  });
}

// Get seat recommendations for mobile
export async function getSeatRecommendationsMobile(sectionId: string, eventId: string, preferences?: {
  seat_type?: string;
  price_range?: {
    min: number;
    max: number;
  };
  quantity: number;
  accessibility_needs?: string[];
}) {
  const params = new URLSearchParams({
    section_id: sectionId,
    event_id: eventId,
    quantity: preferences?.quantity?.toString() || "1"
  });
  
  if (preferences?.seat_type) params.append('seat_type', preferences.seat_type);
  if (preferences?.price_range?.min) params.append('price_min', preferences.price_range.min.toString());
  if (preferences?.price_range?.max) params.append('price_max', preferences.price_range.max.toString());
  if (preferences?.accessibility_needs) {
    preferences.accessibility_needs.forEach(need => params.append('accessibility', need));
  }
  
  return apiGet<{
    recommendations: Seat[];
    alternative_options: Seat[];
    reasoning: string;
    total_price: number;
    currency: 'RWF' | 'USD';
  }>(`/api/seats/recommendations/mobile?${params.toString()}`);
}
