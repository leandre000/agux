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
  return seat.status === 'available';
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
export function getSeatStatusColor(status: Seat['status']): string {
  switch (status) {
    case 'available': return '#10B981'; // green
    case 'occupied': return '#EF4444'; // red
    case 'blocked': return '#6B7280'; // gray
    default: return '#6B7280'; // gray
  }
}

// Get seat status text
export function getSeatStatusText(status: Seat['status']): string {
  switch (status) {
    case 'available': return 'Available';
    case 'occupied': return 'Occupied';
    case 'blocked': return 'Blocked';
    default: return 'Unknown';
  }
}
