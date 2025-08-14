import { apiGet } from "@/config/api";
import {
    Venue,
    VenueSearchFilters,
    PaginatedResponse
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


