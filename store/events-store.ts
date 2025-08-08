import { create } from "zustand";
import { AxiosRequestConfig } from "axios";
import { createApiClient } from "@/config/api";

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
  fetchAll: (config?: AxiosRequestConfig) => Promise<void>;
  fetchById: (id: string, config?: AxiosRequestConfig) => Promise<Event | null>;
}

const api = createApiClient();

function mapBackendEvent(e: any): Event {
  return {
    id: String(e.id ?? e.event_id ?? e.uuid ?? ""),
    title: e.title ?? e.name ?? "Untitled",
    description: e.description ?? "",
    date: String(e.date ?? e.start_date ?? e.createdAt ?? "") || "",
    location: e.venue ?? e.location ?? "",
    imageUrl: e.image_url
      ? `${api.defaults.baseURL}/uploads/${e.image_url}`
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

  fetchAll: async (config) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/events", config);
      const data = Array.isArray(res.data) ? res.data : res.data?.events || [];
      const mapped = data.map(mapBackendEvent);
      set({
        allEvents: mapped,
        featuredEvents: mapped.filter((e: Event) => !!e.isFeatured),
        loading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || "Failed to load events", loading: false });
      throw err;
    }
  },

  fetchById: async (id, config) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/events/${id}`, config);
      const raw = res.data?.event ?? res.data;
      const mapped = mapBackendEvent(raw);
      set({ loading: false });
      return mapped;
    } catch (err: any) {
      set({ error: err?.message || "Failed to load event", loading: false });
      return null;
    }
  },
}));
