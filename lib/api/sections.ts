import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/config/api";
import { 
  Section, 
  CreateSectionRequest, 
  UpdateSectionRequest,
  SeatMapConfig,
  PaginatedResponse,
  ApiResponse 
} from "@/types/ticketing";

// Get all sections for a venue
export async function getSectionsByVenue(venueId: string, page: number = 1, limit: number = 50) {
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

// Create new section (Admin only)
export async function createSection(sectionData: CreateSectionRequest) {
  return apiPost<Section>("/api/sections", sectionData);
}

// Update section (Admin only)
export async function updateSection(sectionId: string, sectionData: UpdateSectionRequest) {
  return apiPut<Section>(`/api/sections/${sectionId}`, sectionData);
}

// Patch section (Admin only) - for partial updates
export async function patchSection(sectionId: string, sectionData: Partial<UpdateSectionRequest>) {
  return apiPatch<Section>(`/api/sections/${sectionId}`, sectionData);
}

// Delete section (Admin only)
export async function deleteSection(sectionId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/sections/${sectionId}`);
}

// Get sections by admin (Admin only)
export async function getSectionsByAdmin(adminId: string, page: number = 1, limit: number = 50) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Section>>(`/api/sections/admin/${adminId}?${params.toString()}`);
}

// Get sections by event
export async function getSectionsByEvent(eventId: string) {
  return apiGet<Section[]>(`/api/events/${eventId}/sections`);
}

// Update seat map configuration for a section (Admin only)
export async function updateSeatMapConfig(sectionId: string, seatMapConfig: SeatMapConfig) {
  return apiPatch<Section>(`/api/sections/${sectionId}/seat-map`, { seat_map_config: seatMapConfig });
}

// Get seat map configuration for a section
export async function getSeatMapConfig(sectionId: string) {
  return apiGet<SeatMapConfig>(`/api/sections/${sectionId}/seat-map`);
}

// Validate seat map configuration
export function validateSeatMapConfig(config: SeatMapConfig): string[] {
  const errors: string[] = [];
  
  if (config.rows < 1 || config.rows > 100) {
    errors.push('Number of rows must be between 1 and 100');
  }
  
  if (config.columns < 1 || config.columns > 50) {
    errors.push('Number of columns must be between 1 and 50');
  }
  
  if (config.row_labels && config.row_labels.length !== config.rows) {
    errors.push('Number of row labels must match number of rows');
  }
  
  if (config.column_labels && config.column_labels.length !== config.columns) {
    errors.push('Number of column labels must match number of columns');
  }
  
  // Validate blocked seats format
  if (config.blocked_seats) {
    for (const seat of config.blocked_seats) {
      if (!/^[A-Z]+\d+$/.test(seat)) {
        errors.push(`Invalid blocked seat format: ${seat}. Expected format: A1, B5, etc.`);
      }
    }
  }
  
  // Validate special seats
  if (config.special_seats) {
    for (const [seatId, seatConfig] of Object.entries(config.special_seats)) {
      if (!/^[A-Z]+\d+$/.test(seatId)) {
        errors.push(`Invalid special seat format: ${seatId}. Expected format: A1, B5, etc.`);
      }
      
      if (!['wheelchair', 'vip', 'reserved'].includes(seatConfig.type)) {
        errors.push(`Invalid seat type: ${seatConfig.type}. Must be wheelchair, vip, or reserved`);
      }
    }
  }
  
  return errors;
}

// Generate seat map configuration from basic parameters
export function generateSeatMapConfig(
  rows: number, 
  columns: number, 
  rowLabels?: string[], 
  columnLabels?: string[]
): SeatMapConfig {
  const config: SeatMapConfig = {
    rows,
    columns,
    row_labels: rowLabels || Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i)), // A, B, C, ...
    column_labels: columnLabels || Array.from({ length: columns }, (_, i) => (i + 1).toString()), // 1, 2, 3, ...
    blocked_seats: [],
    special_seats: {}
  };
  
  return config;
}

// Validate section data before creation/update
export function validateSectionData(data: CreateSectionRequest | UpdateSectionRequest): string[] {
  const errors: string[] = [];
  
  if ('name' in data && (!data.name || data.name.trim().length < 2)) {
    errors.push('Section name must be at least 2 characters long');
  }
  
  if ('venue_id' in data && !data.venue_id) {
    errors.push('Venue ID is required');
  }
  
  if ('capacity' in data && (data.capacity < 1 || data.capacity > 10000)) {
    errors.push('Capacity must be between 1 and 10,000');
  }
  
  if ('seat_map_config' in data && data.seat_map_config) {
    const seatMapErrors = validateSeatMapConfig(data.seat_map_config);
    errors.push(...seatMapErrors);
  }
  
  if ('color_code' in data && data.color_code && !/^#[0-9A-F]{6}$/i.test(data.color_code)) {
    errors.push('Color code must be a valid hex color (e.g., #FF0000)');
  }
  
  return errors;
}

// Get section statistics
export async function getSectionStats(sectionId: string) {
  return apiGet<{
    total_seats: number;
    available_seats: number;
    sold_seats: number;
    blocked_seats: number;
    occupancy_rate: number;
  }>(`/api/sections/${sectionId}/stats`);
}

// Bulk create sections for a venue (Admin only)
export async function bulkCreateSections(venueId: string, sections: CreateSectionRequest[]) {
  return apiPost<Section[]>(`/api/venues/${venueId}/sections/bulk`, { sections });
}

// Copy section configuration from another section (Admin only)
export async function copySectionConfig(sourceSectionId: string, targetSectionId: string) {
  return apiPost<Section>(`/api/sections/${targetSectionId}/copy-config`, { 
    source_section_id: sourceSectionId 
  });
}
