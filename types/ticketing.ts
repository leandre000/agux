// AGURA Ticketing System Types

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Venue Types
export interface Venue extends BaseEntity {
  name: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity: number;
  description?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  parking_available?: boolean;
  wheelchair_accessible?: boolean;
  admin_id: string; // Admin who created the venue
}

export interface CreateVenueRequest {
  name: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity: number;
  description?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  parking_available?: boolean;
  wheelchair_accessible?: boolean;
}

export interface UpdateVenueRequest extends Partial<CreateVenueRequest> {}

// Section Types
export interface Section extends BaseEntity {
  name: string;
  description?: string;
  venue_id: string;
  capacity: number;
  seat_map_config?: SeatMapConfig;
  color_code?: string;
  admin_id: string;
  venue?: Venue;
}

export interface SeatMapConfig {
  rows: number;
  columns: number;
  row_labels?: string[];
  column_labels?: string[];
  blocked_seats?: string[]; // Array of seat identifiers like "A1", "B5"
  special_seats?: {
    [seatId: string]: {
      type: 'wheelchair' | 'vip' | 'reserved';
      description?: string;
    };
  };
}

export interface CreateSectionRequest {
  name: string;
  description?: string;
  venue_id: string;
  capacity: number;
  seat_map_config?: SeatMapConfig;
  color_code?: string;
}

export interface UpdateSectionRequest extends Partial<CreateSectionRequest> {}

// Seat Types
export interface Seat extends BaseEntity {
  seat_number: string; // e.g., "A1", "B5"
  row_label: string;
  column_label: string;
  section_id: string;
  seat_type: 'standard' | 'vip' | 'wheelchair' | 'reserved';
  is_blocked: boolean;
  is_available: boolean;
  price_modifier?: number; // Additional price for premium seats
  section?: Section;
}

export interface CreateSeatRequest {
  seat_number: string;
  row_label: string;
  column_label: string;
  section_id: string;
  seat_type?: 'standard' | 'vip' | 'wheelchair' | 'reserved';
  is_blocked?: boolean;
  price_modifier?: number;
}

export interface CreateBulkSeatsRequest {
  section_id: string;
  seat_map_config: SeatMapConfig;
  seat_type?: 'standard' | 'vip' | 'wheelchair' | 'reserved';
  price_modifier?: number;
}

// Event Types (Enhanced)
export interface Event extends BaseEntity {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time?: string;
  venue_id: string;
  artist_lineup?: string[];
  image_url?: string;
  category: EventCategory;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  max_tickets_per_user?: number;
  admin_id: string;
  venue?: Venue;
  sections?: Section[];
}

export type EventCategory = 'music' | 'sports' | 'business' | 'tech' | 'art' | 'culture' | 'film' | 'comedy' | 'other';

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time?: string;
  venue_id: string;
  artist_lineup?: string[];
  image_url?: string;
  category: EventCategory;
  max_tickets_per_user?: number;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}

// Ticket Category Types (Enhanced)
export interface TicketCategory extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  currency: 'RWF' | 'USD';
  event_id: string;
  section_id: string;
  max_quantity_per_user?: number;
  early_bird_discount?: {
    percentage: number;
    valid_until: string;
  };
  is_active: boolean;
  admin_id: string;
  event?: Event;
  section?: Section;
  available_quantity?: number;
  sold_quantity?: number;
}

export interface CreateTicketCategoryRequest {
  name: string;
  description?: string;
  price: number;
  currency?: 'RWF' | 'USD';
  event_id: string;
  section_id: string;
  max_quantity_per_user?: number;
  early_bird_discount?: {
    percentage: number;
    valid_until: string;
  };
}

export interface UpdateTicketCategoryRequest extends Partial<CreateTicketCategoryRequest> {
  is_active?: boolean;
}

// Ticket Types (Enhanced)
export interface Ticket extends BaseEntity {
  ticket_number: string; // Unique ticket number
  event_id: string;
  category_id: string;
  seat_id?: string;
  user_id: string;
  holder_name: string;
  qr_code: string;
  purchase_date: string;
  price: number;
  currency: 'RWF' | 'USD';
  status: 'active' | 'used' | 'refunded' | 'expired' | 'cancelled';
  used_at?: string;
  refunded_at?: string;
  event?: Event;
  category?: TicketCategory;
  seat?: Seat;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface TicketPurchaseRequest {
  category_id: string;
  quantity: number;
  holder_names: string[];
  payment_method: 'mobile_money' | 'card' | 'bank_transfer';
  payment_details?: {
    phone_number?: string;
    card_token?: string;
    bank_account?: string;
  };
}

export interface TicketPurchaseResponse {
  tickets: Ticket[];
  total_amount: number;
  currency: 'RWF' | 'USD';
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
}

// Seat Availability Types
export interface SeatAvailability {
  seat_id: string;
  seat_number: string;
  row_label: string;
  column_label: string;
  is_available: boolean;
  is_blocked: boolean;
  price: number;
  currency: 'RWF' | 'USD';
}

export interface SectionAvailability {
  section_id: string;
  section_name: string;
  total_seats: number;
  available_seats: number;
  blocked_seats: number;
  sold_seats: number;
  seats: SeatAvailability[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Admin Types
export interface Admin extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'venue_admin' | 'event_admin';
  permissions: string[];
  is_active: boolean;
}

// User Types (Enhanced)
export interface User extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  username?: string;
  gender?: 'male' | 'female' | 'other';
  profile_image?: string;
  preferences?: {
    categories?: string[];
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };
  is_verified: boolean;
  is_active: boolean;
}

// Search and Filter Types
export interface EventSearchFilters {
  category?: EventCategory;
  date_from?: string;
  date_to?: string;
  venue_id?: string;
  price_min?: number;
  price_max?: number;
  search?: string;
}

export interface VenueSearchFilters {
  city?: string;
  country?: string;
  capacity_min?: number;
  capacity_max?: number;
  amenities?: string[];
  search?: string;
}

// Analytics Types
export interface EventAnalytics {
  event_id: string;
  total_tickets_sold: number;
  total_revenue: number;
  currency: 'RWF' | 'USD';
  category_breakdown: {
    category_id: string;
    category_name: string;
    tickets_sold: number;
    revenue: number;
  }[];
  daily_sales: {
    date: string;
    tickets_sold: number;
    revenue: number;
  }[];
}

export interface VenueAnalytics {
  venue_id: string;
  total_events: number;
  total_tickets_sold: number;
  total_revenue: number;
  average_attendance: number;
  popular_sections: {
    section_id: string;
    section_name: string;
    tickets_sold: number;
  }[];
}
