import { apiGet } from "@/config/api";

export interface EventDTO {
  event_id?: string;
  id?: string | number;
  title: string;
  description?: string;
  date?: string;
  venue_id?: string;
  artist_lineup?: string[];
  image_url?: string;
  venue?: any;
  [k: string]: any;
}

export interface TicketCategoryDTO {
  category_id?: string;
  id?: string | number;
  name: string;
  price: number;
  event_id: string;
  section_id?: string;
  [k: string]: any;
}

export async function getEvents() {
  return apiGet<EventDTO[]>("/api/events");
}

export async function getEventById(eventId: string) {
  return apiGet<EventDTO>(`/api/events/${eventId}`);
}

export async function getTicketCategoriesByEvent(eventId: string) {
  return apiGet<TicketCategoryDTO[]>(`/api/ticket-categories/event/${eventId}`);
}
