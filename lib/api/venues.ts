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

// Get nearby venues based on user location
export async function getNearbyVenues(latitude: number, longitude: number, radius: number = 50, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    radius: radius.toString(),
    page: page.toString(),
    limit: limit.toString()
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/nearby?${params.toString()}`);
}

// Get venue details optimized for mobile
export async function getVenueDetailsMobile(venueId: string) {
  return apiGet<Venue & {
    upcoming_events: {
      id: string;
      title: string;
      date: string;
      image_url?: string;
      ticket_count: number;
    }[];
    venue_stats: {
      total_events: number;
      total_capacity: number;
      average_rating: number;
      review_count: number;
    };
    amenities_details: {
      name: string;
      description: string;
      icon: string;
      available: boolean;
    }[];
    parking_info: {
      available: boolean;
      free_spots: number;
      hourly_rate?: number;
      daily_rate?: number;
    };
    accessibility_info: {
      wheelchair_accessible: boolean;
      accessible_parking: boolean;
      accessible_restrooms: boolean;
      hearing_assistance: boolean;
      visual_assistance: boolean;
    };
  }>(`/api/venues/${venueId}/mobile`);
}

// Get venues by city with mobile optimization
export async function getVenuesByCityMobile(city: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    city: city,
    page: page.toString(),
    limit: limit.toString(),
    mobile_optimized: 'true'
  });
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/city/${encodeURIComponent(city)}?${params.toString()}`);
}

// Search venues with mobile-optimized results
export async function searchVenuesMobile(query: string, filters?: {
  city?: string;
  country?: string;
  capacity_min?: number;
  capacity_max?: number;
  amenities?: string[];
}, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
    mobile_optimized: 'true'
  });
  
  if (filters?.city) params.append('city', filters.city);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.capacity_min) params.append('capacity_min', filters.capacity_min.toString());
  if (filters?.capacity_max) params.append('capacity_max', filters.capacity_max.toString());
  if (filters?.amenities) {
    filters.amenities.forEach(amenity => params.append('amenities', amenity));
  }
  
  return apiGet<PaginatedResponse<Venue>>(`/api/venues/search/mobile?${params.toString()}`);
}

// Get venue sections for mobile display
export async function getVenueSectionsMobile(venueId: string) {
  return apiGet<{
    venue_id: string;
    venue_name: string;
    sections: {
      id: string;
      name: string;
      description?: string;
      capacity: number;
      color_code?: string;
      seat_map_preview?: string;
      pricing_info: {
        base_price: number;
        currency: 'RWF' | 'USD';
        price_range: {
          min: number;
          max: number;
        };
      };
    }[];
  }>(`/api/venues/${venueId}/sections/mobile`);
}


