import { apiDelete, apiGet, apiPost, apiPut } from "@/config/api";

// Order Status Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';

// Order Item Types
export type OrderItemType = 'ticket' | 'food' | 'beverage' | 'merchandise';

// Cart Item Interface
export interface CartItem {
  id: string;
  type: OrderItemType;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  metadata?: Record<string, any>;
}

// Cart Interface
export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// Order Interface
export interface Order {
  order_id: string;
  user_id: string;
  event_id?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_id?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
  notes?: string;
  delivery_method?: 'pickup' | 'delivery' | 'digital';
  delivery_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Order Request Interface
export interface CreateOrderRequest {
  event_id?: string;
  items: {
    type: OrderItemType;
    id: string;
    quantity: number;
    metadata?: Record<string, any>;
  }[];
  delivery_method?: 'pickup' | 'delivery' | 'digital';
  delivery_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  notes?: string;
}

// Order Response Interface
export interface OrderResponse {
  success: boolean;
  message?: string;
  order: Order;
}

// Orders List Response Interface
export interface OrdersListResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Cart Functions
export async function getCart(): Promise<Cart> {
  try {
    const response = await apiGet<Cart>('/api/cart');
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      // Create empty cart if none exists
      return {
        id: '',
        user_id: '',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        currency: 'RWF',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function addToCart(
  item: {
    type: OrderItemType;
    id: string;
    quantity: number;
    metadata?: Record<string, any>;
  }
): Promise<Cart> {
  try {
    const response = await apiPost<Cart>('/api/cart/items', item);
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid item data");
    } else if (error.status === 404) {
      throw new Error("Item not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<Cart> {
  try {
    const response = await apiPut<Cart>(`/api/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid quantity");
    } else if (error.status === 404) {
      throw new Error("Item not found in cart");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  try {
    const response = await apiDelete<Cart>(`/api/cart/items/${itemId}`);
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Item not found in cart");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function clearCart(): Promise<Cart> {
  try {
    const response = await apiDelete<Cart>('/api/cart/clear');
    return response.data;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Order Functions
export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  try {
    const response = await apiPost<OrderResponse, CreateOrderRequest>('/api/orders', orderData);
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid order data");
    } else if (error.status === 422) {
      throw new Error("Order validation failed");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const response = await apiGet<Order>(`/api/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Order not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getUserOrders(
  page: number = 1,
  limit: number = 20,
  status?: OrderStatus
): Promise<OrdersListResponse> {
  try {
    let url = `/api/orders/user?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await apiGet<OrdersListResponse>(url);
    return response.data;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function getEventOrders(
  eventId: string,
  page: number = 1,
  limit: number = 20
): Promise<OrdersListResponse> {
  try {
    const response = await apiGet<OrdersListResponse>(
      `/api/orders/event/${eventId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Event not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<{ success: boolean; message?: string; order: Order }> {
  try {
    const body = { status, notes };
    const response = await apiPut<{ success: boolean; message?: string; order: Order }>(
      `/api/orders/${orderId}/status`,
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Invalid status update");
    } else if (error.status === 404) {
      throw new Error("Order not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const body = { reason: reason || 'Customer request' };
    const response = await apiPut<{ success: boolean; message?: string }>(
      `/api/orders/${orderId}/cancel`,
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Order cannot be cancelled at this stage");
    } else if (error.status === 404) {
      throw new Error("Order not found");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

export async function refundOrder(
  orderId: string,
  amount?: number,
  reason?: string
): Promise<{ success: boolean; message?: string; refund_id?: string }> {
  try {
    const body = {
      amount,
      reason: reason || 'Customer request'
    };
    
    const response = await apiPost<{ success: boolean; message?: string; refund_id?: string }>(
      `/api/orders/${orderId}/refund`,
      body
    );
    return response.data;
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Order cannot be refunded at this stage");
    } else if (error.status === 404) {
      throw new Error("Order not found");
    } else if (error.status === 422) {
      throw new Error("Invalid refund amount");
    } else if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Ticket Order Specific Functions
export async function createTicketOrder(
  eventId: string,
  tickets: {
    category_id: string;
    quantity: number;
    holder_names: string[];
    seats?: string[];
  }[]
): Promise<OrderResponse> {
  try {
    const orderData: CreateOrderRequest = {
      event_id: eventId,
      items: tickets.map(ticket => ({
        type: 'ticket' as OrderItemType,
        id: ticket.category_id,
        quantity: ticket.quantity,
        metadata: {
          holder_names: ticket.holder_names,
          seats: ticket.seats,
        }
      }))
    };
    
    return await createOrder(orderData);
  } catch (error: any) {
    throw error;
  }
}

export async function getTicketOrders(eventId?: string): Promise<Order[]> {
  try {
    let url = '/api/orders/tickets';
    if (eventId) {
      url += `?event_id=${eventId}`;
    }
    
    const response = await apiGet<{ success: boolean; orders: Order[] }>(url);
    return response.data.orders;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Food Order Specific Functions
export async function createFoodOrder(
  eventId: string,
  foodItems: {
    food_id: string;
    quantity: number;
    special_instructions?: string;
  }[]
): Promise<OrderResponse> {
  try {
    const orderData: CreateOrderRequest = {
      event_id: eventId,
      items: foodItems.map(item => ({
        type: 'food' as OrderItemType,
        id: item.food_id,
        quantity: item.quantity,
        metadata: {
          special_instructions: item.special_instructions,
        }
      }))
    };
    
    return await createOrder(orderData);
  } catch (error: any) {
    throw error;
  }
}

export async function getFoodOrders(eventId?: string): Promise<Order[]> {
  try {
    let url = '/api/orders/food';
    if (eventId) {
      url += `?event_id=${eventId}`;
    }
    
    const response = await apiGet<{ success: boolean; orders: Order[] }>(url);
    return response.data.orders;
  } catch (error: any) {
    if (error.message?.includes('Network Error')) {
      throw new Error("Network error - Please check your connection");
    }
    throw error;
  }
}

// Utility Functions
export function calculateOrderTotal(items: CartItem[], taxRate: number = 0.18): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
}

export function formatOrderStatus(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  };
  
  return statusMap[status] || status;
}

export function canCancelOrder(status: OrderStatus): boolean {
  return ['pending', 'confirmed'].includes(status);
}

export function canRefundOrder(status: OrderStatus): boolean {
  return ['completed'].includes(status);
}

export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    pending: '#FFA500',
    confirmed: '#007AFF',
    processing: '#FF6B35',
    completed: '#34C759',
    cancelled: '#FF3B30',
    refunded: '#8E8E93'
  };
  
  return colorMap[status] || '#8E8E93';
}
