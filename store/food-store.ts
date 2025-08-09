import { create } from "zustand";
import { createApiClient } from "@/config/api";
import { getToken as readToken } from "@/lib/authToken";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'RWF' | 'USD';
  category: 'food' | 'drinks' | 'snacks';
  image_url?: string;
  rating?: number;
  review_count?: number;
  available: boolean;
  event_id?: string;
  [k: string]: any;
}

export interface CartItem extends MenuItem {
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_id?: string;
  event_id: string;
  items: CartItem[];
  total_amount: number;
  currency: 'RWF' | 'USD';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  order_date: string;
  delivery_address?: string;
  phone_number?: string;
  payment_method?: string;
  [k: string]: any;
}

interface FoodState {
  menuItems: { [eventId: string]: MenuItem[] };
  cart: CartItem[];
  orders: Order[];
  currentEventId: string | null;
  loading: boolean;
  orderLoading: boolean;
  error: string | null;
}

interface FoodStore extends FoodState {
  fetchMenuItems: (eventId: string) => Promise<MenuItem[]>;
  addToCart: (item: MenuItem, quantity: number) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (orderData: {
    event_id: string;
    delivery_address?: string;
    phone_number?: string;
    payment_method: string;
  }) => Promise<Order>;
  fetchUserOrders: (eventId?: string) => Promise<void>;
  getOrdersByEvent: (eventId: string) => Order[];
  reorderItems: (orderId: string) => void;
  setCurrentEventId: (eventId: string) => void;
  clearError: () => void;
}

const api = createApiClient({
  getToken: async () => await readToken(),
});

function mapBackendMenuItem(item: any): MenuItem {
  return {
    id: String(item.id ?? item.menu_id ?? ""),
    name: item.name ?? "Unknown Item",
    description: item.description ?? "",
    price: item.price ?? 0,
    currency: item.currency ?? 'RWF',
    category: item.category ?? 'food',
    image_url: item.image_url ? `${api.defaults.baseURL}/uploads/${item.image_url}` : undefined,
    rating: item.rating ?? 0,
    review_count: item.review_count ?? 0,
    available: Boolean(item.available ?? item.in_stock ?? true),
    event_id: String(item.event_id ?? ""),
    ...item,
  };
}

function mapBackendOrder(order: any): Order {
  return {
    id: String(order.id ?? order.order_id ?? ""),
    order_id: String(order.order_id ?? order.id ?? ""),
    event_id: String(order.event_id ?? ""),
    items: Array.isArray(order.items) ? order.items.map(mapCartItem) : [],
    total_amount: order.total_amount ?? order.total ?? 0,
    currency: order.currency ?? 'RWF',
    status: order.status ?? 'pending',
    order_date: order.order_date ?? order.created_at ?? "",
    delivery_address: order.delivery_address ?? "",
    phone_number: order.phone_number ?? "",
    payment_method: order.payment_method ?? "",
    ...order,
  };
}

function mapCartItem(item: any): CartItem {
  const menuItem = mapBackendMenuItem(item);
  const quantity = item.quantity ?? 1;
  return {
    ...menuItem,
    quantity,
    total: menuItem.price * quantity,
  };
}

export const useFoodStore = create<FoodStore>((set, get) => ({
  menuItems: {},
  cart: [],
  orders: [],
  currentEventId: null,
  loading: false,
  orderLoading: false,
  error: null,

  fetchMenuItems: async (eventId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/menu/event/${eventId}`);
      const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
      const mapped = data.map(mapBackendMenuItem);
      
      const { menuItems } = get();
      set({ 
        menuItems: { ...menuItems, [eventId]: mapped },
        loading: false 
      });
      
      return mapped;
    } catch (err: any) {
      set({ error: err?.message || "Failed to load menu items", loading: false });
      throw err;
    }
  },

  addToCart: (item: MenuItem, quantity: number) => {
    const { cart } = get();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedCart = [...cart];
      const existingItem = updatedCart[existingItemIndex];
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
      set({ cart: updatedCart });
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        ...item,
        quantity,
        total: item.price * quantity,
      };
      set({ cart: [...cart, cartItem] });
    }
  },

  updateCartItem: (itemId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set({ cart: cart.filter(item => item.id !== itemId) });
    } else {
      // Update quantity
      const updated = cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity, total: item.price * quantity }
          : item
      );
      set({ cart: updated });
    }
  },

  removeFromCart: (itemId: string) => {
    const { cart } = get();
    set({ cart: cart.filter(item => item.id !== itemId) });
  },

  clearCart: () => {
    set({ cart: [] });
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.total, 0);
  },

  placeOrder: async (orderData) => {
    const { cart } = get();
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    set({ orderLoading: true, error: null });
    try {
      const body = {
        event_id: orderData.event_id,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: get().getCartTotal(),
        delivery_address: orderData.delivery_address,
        phone_number: orderData.phone_number,
        payment_method: orderData.payment_method,
      };

      const res = await api.post("/api/orders", body);
      const order = mapBackendOrder(res.data?.order ?? res.data);
      
      // Add order to store and clear cart
      const { orders } = get();
      set({ 
        orders: [order, ...orders],
        cart: [],
        orderLoading: false 
      });
      
      return order;
    } catch (err: any) {
      set({ error: err?.message || "Failed to place order", orderLoading: false });
      throw err;
    }
  },

  fetchUserOrders: async (eventId?: string) => {
    set({ loading: true, error: null });
    try {
      const url = eventId ? `/api/orders?event_id=${eventId}` : "/api/orders/my-orders";
      const res = await api.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      const mapped = data.map(mapBackendOrder);
      set({ orders: mapped, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to load orders", loading: false });
      throw err;
    }
  },

  getOrdersByEvent: (eventId: string) => {
    const { orders } = get();
    return orders.filter(order => order.event_id === eventId);
  },

  reorderItems: (orderId: string) => {
    const { orders } = get();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Clear current cart and add order items
      set({ cart: [...order.items] });
    }
  },

  setCurrentEventId: (eventId: string) => {
    set({ currentEventId: eventId });
  },

  clearError: () => set({ error: null }),
}));
