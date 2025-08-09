import { create } from "zustand";
import { createApiClient } from "@/config/api";
import { getToken as readToken } from "@/lib/authToken";

export interface TicketCategory {
  category_id?: string;
  id?: string | number;
  name: string;
  price: number;
  event_id: string;
  section_id?: string;
  available_quantity?: number;
  currency?: 'RWF' | 'USD';
  [k: string]: any;
}

export interface Ticket {
  ticket_id?: string;
  id?: string | number;
  event_id?: string;
  category_id?: string;
  category_name?: string;
  qr_code?: string;
  holder_name?: string;
  purchase_date?: string;
  event_title?: string;
  event_date?: string;
  venue?: string;
  price?: number;
  currency?: 'RWF' | 'USD';
  used?: boolean;
  refunded?: boolean;
  status?: 'active' | 'used' | 'refunded' | 'expired';
  [k: string]: any;
}

export interface TicketPurchase {
  category_id: string;
  quantity: number;
  holder_names: string[];
  seats?: string[];
}

interface TicketsState {
  userTickets: Ticket[];
  ticketCategories: { [eventId: string]: TicketCategory[] };
  loading: boolean;
  error: string | null;
  purchaseLoading: boolean;
}

interface TicketsStore extends TicketsState {
  fetchUserTickets: () => Promise<void>;
  fetchTicketCategories: (eventId: string) => Promise<TicketCategory[]>;
  purchaseTickets: (purchase: TicketPurchase) => Promise<Ticket[]>;
  getTicketsByEvent: (eventId: string) => Ticket[];
  validateTicket: (qrCode: string) => Promise<boolean>;
  useTicket: (ticketId: string) => Promise<void>;
  refundTicket: (ticketId: string) => Promise<void>;
  clearError: () => void;
}

const api = createApiClient({
  getToken: async () => await readToken(),
});

function mapBackendTicket(t: any): Ticket {
  return {
    id: String(t.id ?? t.ticket_id ?? ""),
    ticket_id: String(t.ticket_id ?? t.id ?? ""),
    event_id: String(t.event_id ?? ""),
    category_id: String(t.category_id ?? ""),
    category_name: t.category_name ?? t.category?.name ?? "Standard",
    qr_code: t.qr_code ?? "",
    holder_name: t.holder_name ?? "",
    purchase_date: t.purchase_date ?? t.created_at ?? "",
    event_title: t.event_title ?? t.event?.title ?? "",
    event_date: t.event_date ?? t.event?.date ?? "",
    venue: t.venue ?? t.event?.venue ?? "",
    price: t.price ?? t.category?.price ?? 0,
    currency: t.currency ?? 'RWF',
    used: Boolean(t.used),
    refunded: Boolean(t.refunded),
    status: t.refunded ? 'refunded' : t.used ? 'used' : 'active',
    ...t,
  };
}

function mapBackendTicketCategory(tc: any): TicketCategory {
  return {
    id: String(tc.id ?? tc.category_id ?? ""),
    category_id: String(tc.category_id ?? tc.id ?? ""),
    name: tc.name ?? "Standard",
    price: tc.price ?? 0,
    event_id: String(tc.event_id ?? ""),
    section_id: String(tc.section_id ?? ""),
    available_quantity: tc.available_quantity ?? tc.max_capacity ?? 100,
    currency: tc.currency ?? 'RWF',
    ...tc,
  };
}

export const useTicketsStore = create<TicketsStore>((set, get) => ({
  userTickets: [],
  ticketCategories: {},
  loading: false,
  error: null,
  purchaseLoading: false,

  fetchUserTickets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/tickets/my-tickets");
      const data = Array.isArray(res.data) ? res.data : res.data?.tickets || [];
      const mapped = data.map(mapBackendTicket);
      set({ userTickets: mapped, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to load tickets", loading: false });
      throw err;
    }
  },

  fetchTicketCategories: async (eventId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/ticket-categories/event/${eventId}`);
      const data = Array.isArray(res.data) ? res.data : res.data?.categories || [];
      const mapped = data.map(mapBackendTicketCategory);
      
      const { ticketCategories } = get();
      set({ 
        ticketCategories: { ...ticketCategories, [eventId]: mapped },
        loading: false 
      });
      
      return mapped;
    } catch (err: any) {
      set({ error: err?.message || "Failed to load ticket categories", loading: false });
      throw err;
    }
  },

  purchaseTickets: async (purchase: TicketPurchase) => {
    set({ purchaseLoading: true, error: null });
    try {
      const body = {
        category_id: purchase.category_id,
        quantity: purchase.quantity,
        holder_names: purchase.holder_names,
        seats: purchase.seats,
      };
      
      const res = await api.post("/api/tickets/purchase", body);
      const data = Array.isArray(res.data?.tickets) ? res.data.tickets : [];
      const mapped = data.map(mapBackendTicket);
      
      // Add new tickets to user tickets
      const { userTickets } = get();
      set({ 
        userTickets: [...userTickets, ...mapped],
        purchaseLoading: false 
      });
      
      return mapped;
    } catch (err: any) {
      set({ error: err?.message || "Failed to purchase tickets", purchaseLoading: false });
      throw err;
    }
  },

  getTicketsByEvent: (eventId: string) => {
    const { userTickets } = get();
    return userTickets.filter(ticket => ticket.event_id === eventId);
  },

  validateTicket: async (qrCode: string) => {
    try {
      const res = await api.get(`/api/tickets/validate/${encodeURIComponent(qrCode)}`);
      return res.data?.valid ?? false;
    } catch (err: any) {
      set({ error: err?.message || "Failed to validate ticket" });
      return false;
    }
  },

  useTicket: async (ticketId: string) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/tickets/${ticketId}/use`);
      
      // Update ticket status in store
      const { userTickets } = get();
      const updated = userTickets.map(ticket => 
        ticket.ticket_id === ticketId 
          ? { ...ticket, used: true, status: 'used' as const }
          : ticket
      );
      set({ userTickets: updated, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to use ticket", loading: false });
      throw err;
    }
  },

  refundTicket: async (ticketId: string) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/tickets/${ticketId}/refund`);
      
      // Update ticket status in store
      const { userTickets } = get();
      const updated = userTickets.map(ticket => 
        ticket.ticket_id === ticketId 
          ? { ...ticket, refunded: true, status: 'refunded' as const }
          : ticket
      );
      set({ userTickets: updated, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to refund ticket", loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
