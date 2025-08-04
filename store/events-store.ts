import { create } from 'zustand';
import { Event, events, userEvents, EventCategory } from '@/mocks/events';

interface EventsState {
  allEvents: Event[];
  userEvents: Event[];
  featuredEvents: Event[];
  selectedCategories: EventCategory[];
  searchQuery: string;
}

interface EventsStore extends EventsState {
  setSelectedCategories: (categories: EventCategory[]) => void;
  setSearchQuery: (query: string) => void;
  getFilteredEvents: () => Event[];
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  allEvents: events,
  userEvents: userEvents,
  featuredEvents: events.filter(event => event.isFeatured),
  selectedCategories: [],
  searchQuery: '',

  setSelectedCategories: (categories) => {
    set({ selectedCategories: categories });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredEvents: () => {
    const { allEvents, selectedCategories, searchQuery } = get();
    
    return allEvents.filter(event => {
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(event.category);
      
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  },
}));