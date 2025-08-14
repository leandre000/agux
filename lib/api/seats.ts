import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/config/api";
import { 
  Seat, 
  CreateSeatRequest, 
  CreateBulkSeatsRequest,
  SeatAvailability,
  SectionAvailability,
  PaginatedResponse,
  ApiResponse 
} from "@/types/ticketing";

// Get all seats for a section
export async function getSeatsBySection(sectionId: string, page: number = 1, limit: number = 100) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Seat>>(`/api/sections/${sectionId}/seats?${params.toString()}`);
}

// Get seat by ID
export async function getSeatById(seatId: string) {
  return apiGet<Seat>(`/api/seats/${seatId}`);
}

// Create single seat (Admin only)
export async function createSeat(seatData: CreateSeatRequest) {
  return apiPost<Seat>("/api/seats", seatData);
}

// Create multiple seats in bulk (Admin only)
export async function createBulkSeats(bulkData: CreateBulkSeatsRequest) {
  return apiPost<Seat[]>(`/api/sections/${bulkData.section_id}/seats/bulk`, bulkData);
}

// Update seat (Admin only)
export async function updateSeat(seatId: string, seatData: Partial<CreateSeatRequest>) {
  return apiPut<Seat>(`/api/seats/${seatId}`, seatData);
}

// Patch seat (Admin only) - for partial updates
export async function patchSeat(seatId: string, seatData: Partial<CreateSeatRequest>) {
  return apiPatch<Seat>(`/api/seats/${seatId}`, seatData);
}

// Delete seat (Admin only)
export async function deleteSeat(seatId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/seats/${seatId}`);
}

// Get seat availability for a section
export async function getSeatAvailability(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<SectionAvailability>(`/api/sections/${sectionId}/seats/availability?${params.toString()}`);
}

// Get available seats for a ticket category
export async function getAvailableSeatsForCategory(categoryId: string) {
  return apiGet<SeatAvailability[]>(`/api/ticket-categories/${categoryId}/available-seats`);
}

// Check if specific seats are available
export async function checkSeatAvailability(seatIds: string[], eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiPost<{ [seatId: string]: boolean }>(`/api/seats/check-availability?${params.toString()}`, {
    seat_ids: seatIds
  });
}

// Reserve seats temporarily (for booking process)
export async function reserveSeats(seatIds: string[], reservationDuration: number = 300) { // 5 minutes default
  return apiPost<{ reservation_id: string; expires_at: string }>("/api/seats/reserve", {
    seat_ids: seatIds,
    duration: reservationDuration
  });
}

// Release seat reservation
export async function releaseSeatReservation(reservationId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/seats/reservations/${reservationId}`);
}

// Block seats (Admin only)
export async function blockSeats(seatIds: string[], reason?: string) {
  return apiPatch<Seat[]>(`/api/seats/block`, {
    seat_ids: seatIds,
    reason: reason || 'Admin blocked'
  });
}

// Unblock seats (Admin only)
export async function unblockSeats(seatIds: string[]) {
  return apiPatch<Seat[]>(`/api/seats/unblock`, {
    seat_ids: seatIds
  });
}

// Get seats by type
export async function getSeatsByType(sectionId: string, seatType: 'standard' | 'vip' | 'wheelchair' | 'reserved') {
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/type/${seatType}`);
}

// Get seat map for a section
export async function getSeatMap(sectionId: string, eventId?: string) {
  const params = new URLSearchParams();
  if (eventId) params.append('event_id', eventId);
  
  return apiGet<{
    section_id: string;
    section_name: string;
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
  }>(`/api/sections/${sectionId}/seat-map?${params.toString()}`);
}

// Generate seats from seat map configuration
export async function generateSeatsFromConfig(sectionId: string, seatType: 'standard' | 'vip' | 'wheelchair' | 'reserved' = 'standard') {
  return apiPost<Seat[]>(`/api/sections/${sectionId}/seats/generate`, {
    seat_type: seatType
  });
}

// Get seat statistics for a section
export async function getSeatStats(sectionId: string) {
  return apiGet<{
    total_seats: number;
    available_seats: number;
    blocked_seats: number;
    sold_seats: number;
    vip_seats: number;
    wheelchair_seats: number;
    reserved_seats: number;
    standard_seats: number;
  }>(`/api/sections/${sectionId}/seats/stats`);
}

// Validate seat data before creation/update
export function validateSeatData(data: CreateSeatRequest): string[] {
  const errors: string[] = [];
  
  if (!data.seat_number || data.seat_number.trim().length === 0) {
    errors.push('Seat number is required');
  }
  
  if (!data.row_label || data.row_label.trim().length === 0) {
    errors.push('Row label is required');
  }
  
  if (!data.column_label || data.column_label.trim().length === 0) {
    errors.push('Column label is required');
  }
  
  if (!data.section_id) {
    errors.push('Section ID is required');
  }
  
  if (data.seat_type && !['standard', 'vip', 'wheelchair', 'reserved'].includes(data.seat_type)) {
    errors.push('Invalid seat type. Must be standard, vip, wheelchair, or reserved');
  }
  
  if (data.price_modifier !== undefined && data.price_modifier < 0) {
    errors.push('Price modifier cannot be negative');
  }
  
  return errors;
}

// Validate bulk seat creation data
export function validateBulkSeatData(data: CreateBulkSeatsRequest): string[] {
  const errors: string[] = [];
  
  if (!data.section_id) {
    errors.push('Section ID is required');
  }
  
  if (!data.seat_map_config) {
    errors.push('Seat map configuration is required');
  } else {
    if (data.seat_map_config.rows < 1 || data.seat_map_config.rows > 100) {
      errors.push('Number of rows must be between 1 and 100');
    }
    
    if (data.seat_map_config.columns < 1 || data.seat_map_config.columns > 50) {
      errors.push('Number of columns must be between 1 and 50');
    }
  }
  
  if (data.seat_type && !['standard', 'vip', 'wheelchair', 'reserved'].includes(data.seat_type)) {
    errors.push('Invalid seat type. Must be standard, vip, wheelchair, or reserved');
  }
  
  if (data.price_modifier !== undefined && data.price_modifier < 0) {
    errors.push('Price modifier cannot be negative');
  }
  
  return errors;
}

// Generate seat number from row and column
export function generateSeatNumber(rowLabel: string, columnLabel: string): string {
  return `${rowLabel}${columnLabel}`;
}

// Parse seat number to get row and column
export function parseSeatNumber(seatNumber: string): { rowLabel: string; columnLabel: string } | null {
  const match = seatNumber.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  return {
    rowLabel: match[1],
    columnLabel: match[2]
  };
}

// Get seats by price range
export async function getSeatsByPriceRange(sectionId: string, minPrice: number, maxPrice: number) {
  const params = new URLSearchParams({
    min_price: minPrice.toString(),
    max_price: maxPrice.toString()
  });
  
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/price-range?${params.toString()}`);
}

// Get premium seats (VIP, reserved, etc.)
export async function getPremiumSeats(sectionId: string) {
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/premium`);
}

// Get accessible seats (wheelchair accessible)
export async function getAccessibleSeats(sectionId: string) {
  return apiGet<Seat[]>(`/api/sections/${sectionId}/seats/accessible`);
}
