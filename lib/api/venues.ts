import { apiGet, apiPost, apiPut } from "@/config/api";

export interface Venue {
  venue_id: string;
  name: string;
  location?: string;
  capacity?: number;
  created_at?: string;
  updated_at?: string;
  [k: string]: any;
}

export interface Paginated<T> {
  data: T[];
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
}

export async function getVenues() {
  return apiGet<Venue[]>("/api/venues");
}

export async function getVenueById(venueId: string) {
  return apiGet<Venue>(`/api/venues/${venueId}`);
}

export async function createVenue(body: Partial<Venue>) {
  return apiPost<Venue, Partial<Venue>>("/api/venues", body);
}

export async function updateVenue(venueId: string, body: Partial<Venue>) {
  return apiPut<Venue, Partial<Venue>>(`/api/venues/${venueId}`, body);
}

