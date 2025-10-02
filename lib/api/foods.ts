import { apiGet, apiPost, apiPut } from "@/config/api";

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: 'RWF' | 'USD';
  image_url?: string;
  event_id?: string | null;
  created_at?: string;
  updated_at?: string;
  [k: string]: any;
}

export async function getFoods() {
  return apiGet<FoodItem[]>("/api/foods");
}

export async function getFoodsForEvent(eventId: string) {
  return apiGet<FoodItem[]>(`/api/foods/event/${eventId}`);
}

export async function getGeneralFoods() {
  return apiGet<FoodItem[]>("/api/foods/general");
}

export async function getFoodById(id: string) {
  return apiGet<FoodItem>(`/api/foods/${id}`);
}

export async function createFood(body: Partial<FoodItem>) {
  return apiPost<FoodItem, Partial<FoodItem>>("/api/foods", body);
}

export async function updateFood(id: string, body: Partial<FoodItem>) {
  return apiPut<FoodItem, Partial<FoodItem>>(`/api/foods/${id}`, body);
}


