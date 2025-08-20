import * as OrdersAPI from "@/lib/api/orders";
import {
    Cart,
    CreateOrderRequest,
    Order,
    OrderItemType,
    OrderStatus
} from "@/lib/api/orders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Orders State Interface
interface OrdersState {
  // Cart Management
  cart: Cart;
  cartLoading: boolean;
  cartError: string | null;
  
  // Orders Management
  userOrders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  
  // Current Order
  currentOrder: Order | null;
  orderProcessing: boolean;
  orderError: string | null;
  
  // Pagination
  ordersPage: number;
  ordersLimit: number;
  ordersTotal: number;
  ordersTotalPages: number;
  
  // Filters
  selectedStatus: OrderStatus | null;
  selectedEventId: string | null;
}

// Orders Store Interface
interface OrdersStore extends OrdersState {
  // Cart Operations
  fetchCart: () => Promise<void>;
  addToCart: (item: {
    type: OrderItemType;
    id: string;
    quantity: number;
    metadata?: Record<string, any>;
  }) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Order Operations
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order>;
  getUserOrders: (page?: number, limit?: number, status?: OrderStatus) => Promise<void>;
  getEventOrders: (eventId: string, page?: number, limit?: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<boolean>;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  refundOrder: (orderId: string, amount?: number, reason?: string) => Promise<boolean>;
  
  // Ticket Orders
  createTicketOrder: (
    eventId: string,
    tickets: {
      category_id: string;
      quantity: number;
      holder_names: string[];
      seats?: string[];
    }[]
  ) => Promise<Order>;
  getTicketOrders: (eventId?: string) => Promise<Order[]>;
  
  // Food Orders
  createFoodOrder: (
    eventId: string,
    foodItems: {
      food_id: string;
      quantity: number;
      special_instructions?: string;
    }[]
  ) => Promise<Order>;
  getFoodOrders: (eventId?: string) => Promise<Order[]>;
  
  // Utility Functions
  calculateCartTotal: () => { subtotal: number; tax: number; total: number };
  getOrderById: (orderId: string) => Order | null;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrdersByEvent: (eventId: string) => Order[];
  
  // State Management
  setSelectedStatus: (status: OrderStatus | null) => void;
  setSelectedEventId: (eventId: string | null) => void;
  clearError: () => void;
  resetOrder: () => void;
  resetPagination: () => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      // Initial State
      cart: {
        id: '',
        user_id: '',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        currency: 'RWF',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      cartLoading: false,
      cartError: null,
      userOrders: [],
      ordersLoading: false,
      ordersError: null,
      currentOrder: null,
      orderProcessing: false,
      orderError: null,
      ordersPage: 1,
      ordersLimit: 20,
      ordersTotal: 0,
      ordersTotalPages: 0,
      selectedStatus: null,
      selectedEventId: null,

      // Cart Operations
      fetchCart: async () => {
        set({ cartLoading: true, cartError: null });
        try {
          const cart = await OrdersAPI.getCart();
          set({ cart, cartLoading: false });
        } catch (error: any) {
          set({ 
            cartError: error.message || "Failed to fetch cart",
            cartLoading: false 
          });
        }
      },

      addToCart: async (item) => {
        set({ cartLoading: true, cartError: null });
        try {
          const updatedCart = await OrdersAPI.addToCart(item);
          set({ cart: updatedCart, cartLoading: false });
        } catch (error: any) {
          set({ 
            cartError: error.message || "Failed to add item to cart",
            cartLoading: false 
          });
          throw error;
        }
      },

      updateCartItem: async (itemId, quantity) => {
        set({ cartLoading: true, cartError: null });
        try {
          const updatedCart = await OrdersAPI.updateCartItem(itemId, quantity);
          set({ cart: updatedCart, cartLoading: false });
        } catch (error: any) {
          set({ 
            cartError: error.message || "Failed to update cart item",
            cartLoading: false 
          });
          throw error;
        }
      },

      removeFromCart: async (itemId) => {
        set({ cartLoading: true, cartError: null });
        try {
          const updatedCart = await OrdersAPI.removeFromCart(itemId);
          set({ cart: updatedCart, cartLoading: false });
        } catch (error: any) {
          set({ 
            cartError: error.message || "Failed to remove item from cart",
            cartLoading: false 
          });
          throw error;
        }
      },

      clearCart: async () => {
        set({ cartLoading: true, cartError: null });
        try {
          const emptyCart = await OrdersAPI.clearCart();
          set({ cart: emptyCart, cartLoading: false });
        } catch (error: any) {
          set({ 
            cartError: error.message || "Failed to clear cart",
            cartLoading: false 
          });
          throw error;
        }
      },

      // Order Operations
      createOrder: async (orderData) => {
        set({ orderProcessing: true, orderError: null });
        try {
          const response = await OrdersAPI.createOrder(orderData);
          const order = response.order;
          
          // Add to user orders
          const { userOrders } = get();
          set({ 
            userOrders: [order, ...userOrders],
            currentOrder: order,
            orderProcessing: false 
          });
          
          // Clear cart after successful order
          await get().clearCart();
          
          return order;
        } catch (error: any) {
          set({ 
            orderError: error.message || "Failed to create order",
            orderProcessing: false 
          });
          throw error;
        }
      },

      getOrder: async (orderId) => {
        try {
          const order = await OrdersAPI.getOrder(orderId);
          set({ currentOrder: order });
          return order;
        } catch (error: any) {
          set({ orderError: error.message || "Failed to get order" });
          throw error;
        }
      },

      getUserOrders: async (page = 1, limit = 20, status) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await OrdersAPI.getUserOrders(page, limit, status);
          set({ 
            userOrders: response.orders,
            ordersPage: response.pagination.page,
            ordersLimit: response.pagination.limit,
            ordersTotal: response.pagination.total,
            ordersTotalPages: response.pagination.total_pages,
            ordersLoading: false 
          });
        } catch (error: any) {
          set({ 
            ordersError: error.message || "Failed to fetch user orders",
            ordersLoading: false 
          });
        }
      },

      getEventOrders: async (eventId, page = 1, limit = 20) => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await OrdersAPI.getEventOrders(eventId, page, limit);
          set({ 
            userOrders: response.orders,
            ordersPage: response.pagination.page,
            ordersLimit: response.pagination.limit,
            ordersTotal: response.pagination.total,
            ordersTotalPages: response.pagination.total_pages,
            ordersLoading: false 
          });
        } catch (error: any) {
          set({ 
            ordersError: error.message || "Failed to fetch event orders",
            ordersLoading: false 
          });
        }
      },

      updateOrderStatus: async (orderId, status, notes) => {
        try {
          const response = await OrdersAPI.updateOrderStatus(orderId, status, notes);
          if (response.success) {
            // Update order in local state
            const { userOrders } = get();
            const updatedOrders = userOrders.map(order => 
              order.order_id === orderId 
                ? { ...order, status, notes: notes || order.notes }
                : order
            );
            set({ userOrders: updatedOrders });
            
            // Update current order if it's the same
            const { currentOrder } = get();
            if (currentOrder && currentOrder.order_id === orderId) {
              set({ currentOrder: { ...currentOrder, status, notes: notes || currentOrder.notes } });
            }
          }
          return response.success;
        } catch (error: any) {
          set({ orderError: error.message || "Failed to update order status" });
          return false;
        }
      },

      cancelOrder: async (orderId, reason) => {
        try {
          const response = await OrdersAPI.cancelOrder(orderId, reason);
          if (response.success) {
            // Update order status in local state
            await get().updateOrderStatus(orderId, 'cancelled' as OrderStatus, reason);
          }
          return response.success;
        } catch (error: any) {
          set({ orderError: error.message || "Failed to cancel order" });
          return false;
        }
      },

      refundOrder: async (orderId, amount, reason) => {
        try {
          const response = await OrdersAPI.refundOrder(orderId, amount, reason);
          if (response.success) {
            // Update order status in local state
            await get().updateOrderStatus(orderId, 'refunded' as OrderStatus, reason);
          }
          return response.success;
        } catch (error: any) {
          set({ orderError: error.message || "Failed to refund order" });
          return false;
        }
      },

      // Ticket Orders
      createTicketOrder: async (eventId, tickets) => {
        try {
          const response = await OrdersAPI.createTicketOrder(eventId, tickets);
          return response.order;
        } catch (error: any) {
          throw error;
        }
      },

      getTicketOrders: async (eventId) => {
        try {
          const orders = await OrdersAPI.getTicketOrders(eventId);
          return orders;
        } catch (error: any) {
          set({ ordersError: error.message || "Failed to fetch ticket orders" });
          return [];
        }
      },

      // Food Orders
      createFoodOrder: async (eventId, foodItems) => {
        try {
          const response = await OrdersAPI.createFoodOrder(eventId, foodItems);
          return response.order;
        } catch (error: any) {
          throw error;
        }
      },

      getFoodOrders: async (eventId) => {
        try {
          const orders = await OrdersAPI.getFoodOrders(eventId);
          return orders;
        } catch (error: any) {
          set({ ordersError: error.message || "Failed to fetch food orders" });
          return [];
        }
      },

      // Utility Functions
      calculateCartTotal: () => {
        const { cart } = get();
        return OrdersAPI.calculateOrderTotal(cart.items);
      },

      getOrderById: (orderId) => {
        const { userOrders } = get();
        return userOrders.find(order => order.order_id === orderId) || null;
      },

      getOrdersByStatus: (status) => {
        const { userOrders } = get();
        return userOrders.filter(order => order.status === status);
      },

      getOrdersByEvent: (eventId) => {
        const { userOrders } = get();
        return userOrders.filter(order => order.event_id === eventId);
      },

      // State Management
      setSelectedStatus: (status) => {
        set({ selectedStatus: status });
      },

      setSelectedEventId: (eventId) => {
        set({ selectedEventId: eventId });
      },

      clearError: () => {
        set({ 
          cartError: null, 
          ordersError: null, 
          orderError: null 
        });
      },

      resetOrder: () => {
        set({ 
          currentOrder: null,
          orderProcessing: false,
          orderError: null
        });
      },

      resetPagination: () => {
        set({ 
          ordersPage: 1,
          ordersTotal: 0,
          ordersTotalPages: 0
        });
      },
    }),
    {
      name: "agura-orders",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cart: state.cart,
        selectedStatus: state.selectedStatus,
        selectedEventId: state.selectedEventId,
      }),
    }
  )
);
