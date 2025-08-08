import { apiGet, apiPost, apiPut } from "@/config/api";

export type SeatStatus = "Available" | "Unavailable" | "Sold Out" | "Selected";

export interface SeatDTO {
  seat_id?: string;
  id?: string | number;
  section_id?: string;
  number?: number | string;
  row?: string | number;
  status?: SeatStatus;
  [k: string]: any;
}

export interface ReserveSeatsBody {
  seatIds: string[];
}

export async function getAvailableSeatsBySection(sectionId: string) {
  return apiGet<SeatDTO[]>(`/api/sections/${sectionId}/seats/available`);
}

export async function getSeatsBySection(sectionId: string) {
  return apiGet<SeatDTO[]>(`/api/sections/${sectionId}/seats`);
}

export async function getAvailableSeatsByCategory(categoryId: string) {
  return apiGet<SeatDTO[]>(
    `/api/ticket-categories/${categoryId}/available-seats`
  );
}

export async function reserveSeats(seatIds: string[]) {
  const body: ReserveSeatsBody = { seatIds };
  return apiPost(`/api/seats/reserve`, body);
}

export async function releaseSeats(seatIds: string[]) {
  const body: ReserveSeatsBody = { seatIds };
  return apiPost(`/api/seats/release`, body);
}

export async function updateSeatStatus(seatId: string, status: SeatStatus) {
  return apiPut(`/api/seats/${seatId}/status`, { status });
}
