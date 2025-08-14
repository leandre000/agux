import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/config/api";
import { 
  Venue, 
  CreateVenueRequest, 
  UpdateVenueRequest, 
  VenueSearchFilters,
  VenueAnalytics,
  PaginatedResponse,
  ApiResponse 
} from "@/types/ticketing";

// Get all venues with optional filters
export async function getVenues(filters?: VenueSearchFilters, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams();
  
  if (filters?.city) params.append('city', filters.city);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.capacity_min) params.append('capacity_min', filters.capacity_min.toString());
  if (filters?.capacity_max) params.append('capacity_max', filters.capacity_max.toString());
  if (filters?.amenities) {
    filters.amenities.forEach(amenity => params.append('amenities', amenity));
  }
  if (filters?.search) params.append('search', filters.search);
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues?${params.toString()}`);
}

// Get venue by ID
export async function getVenueById(venueId: string) {
  return apiGet<Venue>(`/api/venues/${venueId}`);
}

// Create new venue (Admin only)
export async function createVenue(venueData: CreateVenueRequest) {
  return apiPost<Venue>("/api/venues", venueData);
}

// Update venue (Admin only)
export async function updateVenue(venueId: string, venueData: UpdateVenueRequest) {
  return apiPut<Venue>(`/api/venues/${venueId}`, venueData);
}

// Patch venue (Admin only) - for partial updates
export async function patchVenue(venueId: string, venueData: Partial<UpdateVenueRequest>) {
  return apiPatch<Venue>(`/api/venues/${venueId}`, venueData);
}

// Delete venue (Admin only)
export async function deleteVenue(venueId: string) {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/venues/${venueId}`);
}

// Get venues by admin (Admin only)
export async function getVenuesByAdmin(adminId: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/admin/${adminId}?${params.toString()}`);
}

// Get venue analytics (Admin only)
export async function getVenueAnalytics(venueId: string, dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.append('date_from', dateFrom);
  if (dateTo) params.append('date_to', dateTo);
  
  return apiGet<VenueAnalytics>(`/api/venues/${venueId}/analytics?${params.toString()}`);
}

// Search venues by name or location
export async function searchVenues(query: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/search?${params.toString()}`);
}

// Get venues by city
export async function getVenuesByCity(city: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/city/${encodeURIComponent(city)}?${params.toString()}`);
}

// Get popular venues (based on event count or ticket sales)
export async function getPopularVenues(limit: number = 10) {
  return apiGet<Venue[]>(`/api/venues/popular?limit=${limit}`);
}

// Upload venue image (Admin only)
export async function uploadVenueImage(venueId: string, imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return apiPost<{ image_url: string }>(`/api/venues/${venueId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Validate venue data before creation/update
export function validateVenueData(data: CreateVenueRequest | UpdateVenueRequest): string[] {
  const errors: string[] = [];
  
  if ('name' in data && (!data.name || data.name.trim().length < 2)) {
    errors.push('Venue name must be at least 2 characters long');
  }
  
  if ('address' in data && (!data.address || data.address.trim().length < 5)) {
    errors.push('Venue address must be at least 5 characters long');
  }
  
  if ('city' in data && (!data.city || data.city.trim().length < 2)) {
    errors.push('City must be at least 2 characters long');
  }
  
  if ('country' in data && (!data.country || data.country.trim().length < 2)) {
    errors.push('Country must be at least 2 characters long');
  }
  
  if ('capacity' in data && (data.capacity < 1 || data.capacity > 100000)) {
    errors.push('Capacity must be between 1 and 100,000');
  }
  
  if ('email' in data && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if ('phone' in data && data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  if ('latitude' in data && data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  
  if ('longitude' in data && data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  return errors;
}
