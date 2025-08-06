import { apiGet, apiPost, apiPut } from "@/config/api";

export interface PurchaseTicketsBody {
  categoryId: string;
  seatIds: string[];
}
export interface PurchaseTicketsResponse {
  message?: string;
  tickets?: any[];
  [k: string]: any;
}

export interface TicketDTO {
  ticket_id?: string;
  id?: string | number;
  event_id?: string;
  category_id?: string;
  seat_id?: string;
  qr_code?: string;
  used?: boolean;
  refunded?: boolean;
  [k: string]: any;
}

export async function purchaseTickets(body: PurchaseTicketsBody) {
  return apiPost<PurchaseTicketsResponse, PurchaseTicketsBody>(
    "/api/tickets/purchase",
    body
  );
}

export async function getMyTickets() {
  return apiGet<TicketDTO[]>("/api/tickets/my-tickets");
}

export async function getTicketById(ticketId: string) {
  return apiGet<TicketDTO>(`/api/tickets/${ticketId}`);
}

export async function validateTicket(qrCode: string) {
  return apiGet(`/api/tickets/validate/${encodeURIComponent(qrCode)}`);
}

export async function useTicket(ticketId: string) {
  return apiPut(`/api/tickets/${ticketId}/use`);
}

export async function refundTicket(ticketId: string) {
  return apiPut(`/api/tickets/${ticketId}/refund`);
}
