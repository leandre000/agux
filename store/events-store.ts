import * as EventsAPI from "@/lib/api/events";
import { handleError } from "@/lib/errorHandler";
import { create } from "zustand";

// Align with minimal fields expected by UI components
export type EventCategory = "music" | "sports" | "business" | "tech" | "other";

// Extend Event shape to satisfy EventCard props from existing UI
export interface Event {
  id: string;
  title: string;
  description?: string;
  // make required for compatibility with mocks/components typing
  date: string;
  location: string;
  // EventCard in this project expects these optional props
  image?: any; // allow local require(...) or { uri: string }
  imageUrl?: string; // convenience for remote images
  price?: number; // optional, if backend provides pricing
  booked?: boolean; // optional, for user-specific state
  category: EventCategory;
  isFeatured?: boolean;
  [k: string]: any;
}

interface EventsState {
  allEvents: Event[];
  userEvents: Event[];
  featuredEvents: Event[];
  selectedCategories: EventCategory[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

interface EventsStore extends EventsState {
  setSelectedCategories: (categories: EventCategory[]) => void;
  setSearchQuery: (query: string) => void;
  getFilteredEvents: () => Event[];
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<Event | null>;
  fetchFeatured: () => Promise<void>;
  fetchByCategory: (category: EventCategory) => Promise<void>;
  searchEvents: (query: string) => Promise<void>;
}

function mapBackendEvent(e: any): Event {
  return {
    id: String(e.id ?? e.event_id ?? e.uuid ?? ""),
    title: e.title ?? e.name ?? "Untitled",
    description: e.description ?? "",
    date: String(e.date ?? e.start_date ?? e.createdAt ?? "") || "",
    location: e.venue ?? e.location ?? "",
    imageUrl: e.image_url
      ? `${process.env.EXPO_PUBLIC_API_URL || 'https://api.agura.com'}/uploads/${e.image_url}`
      : undefined,
    category: (e.category?.toLowerCase?.() as EventCategory) || "other",
    isFeatured: Boolean(e.is_featured ?? e.featured),
    ...e,
  };
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  allEvents: [],
  userEvents: [],
  featuredEvents: [],
  selectedCategories: [],
  searchQuery: "",
  loading: false,
  error: null,

  setSelectedCategories: (categories) => {
    set({ selectedCategories: categories });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredEvents: () => {
    const { allEvents, selectedCategories, searchQuery } = get();

    return allEvents.filter((event) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        event.title.toLowerCase().includes(q) ||
        (event.location || "").toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const response = await EventsAPI.getEvents();
      const data = response.data?.data || [];
      const mapped = data.map(mapBackendEvent);
      set({
        allEvents: mapped,
        loading: false,
      });
    } catch (err: any) {
      // Use our new error handler
      const appError = handleError(err, 'events-store.fetchAll');
      set({ error: appError.getUserFriendlyMessage(), loading: false });
      throw appError;
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await EventsAPI.getEventById(id);
      const raw = response.data;
      const mapped = mapBackendEvent(raw);
      set({ loading: false });
      return mapped;
    } catch (err: any) {
      // Use our new error handler
      const appError = handleError(err, 'events-store.fetchById');
      set({ error: appError.getUserFriendlyMessage(), loading: false });
      return null;
    }
  },

  fetchFeatured: async () => {
    set({ loading: true, error: null });
    try {
      const response = await EventsAPI.getFeaturedEvents();
      const data = response.data || [];
      const mapped = data.map(mapBackendEvent);
      set({
        featuredEvents: mapped,
        loading: false,
      });
    } catch (err: any) {
      // Use our new error handler
      const appError = handleError(err, 'events-store.fetchFeatured');
      set({ error: appError.getUserFriendlyMessage(), loading: false });
      throw appError;
    }
  },

  fetchByCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const response = await EventsAPI.getEventsByCategory(category);
      const data = response.data?.data || [];
      const mapped = data.map(mapBackendEvent);
      set({
        allEvents: mapped,
        loading: false,
      });
    } catch (err: any) {
      // Use our new error handler
      const appError = handleError(err, 'events-store.fetchByCategory');
      set({ error: appError.getUserFriendlyMessage(), loading: false });
      throw appError;
    }
  },

  searchEvents: async (query) => {
    set({ loading: true, error: null, searchQuery: query });
    try {
      const response = await EventsAPI.searchEvents(query);
      const data = response.data?.data || [];
      const mapped = data.map(mapBackendEvent);
      set({
        allEvents: mapped,
        loading: false,
      });
    } catch (err: any) {
      // Use our new error handler
      const appError = handleError(err, 'events-store.searchEvents');
      set({ error: appError.getUserFriendlyMessage(), loading: false });
      throw appError;
    }
  },
}));
