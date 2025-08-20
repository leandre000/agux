import * as PaymentAPI from "@/lib/api/payment";
import {
    CardType,
    PaymentMethod,
    PaymentMethodsResponse,
    PaymentResponse,
    PaymentStatus
} from "@/lib/api/payment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Payment State Interface
interface PaymentState {
  // Payment Methods
  availableMethods: PaymentMethodsResponse['payment_methods'];
  selectedMethod: PaymentMethod | null;
  
  // Current Payment
  currentPayment: PaymentResponse | null;
  paymentLoading: boolean;
  paymentError: string | null;
  
  // Payment History
  paymentHistory: PaymentResponse[];
  historyLoading: boolean;
  historyError: string | null;
  
  // Saved Cards
  savedCards: {
    card_token: string;
    last_four: string;
    expiry_month: string;
    expiry_year: string;
    holder_name: string;
    card_type: CardType;
    is_default: boolean;
  }[];
  cardsLoading: boolean;
  cardsError: string | null;
  
  // Cart/Order Integration
  cartTotal: number;
  currency: string;
}

// Payment Store Interface
interface PaymentStore extends PaymentState {
  // Payment Method Management
  fetchAvailableMethods: () => Promise<void>;
  selectPaymentMethod: (method: PaymentMethod) => void;
  
  // Payment Processing
  initiatePayment: (paymentData: PaymentAPI.PaymentRequest) => Promise<PaymentResponse>;
  verifyPayment: (paymentId: string) => Promise<boolean>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentResponse>;
  cancelPayment: (paymentId: string) => Promise<boolean>;
  refundPayment: (paymentId: string, amount?: number, reason?: string) => Promise<boolean>;
  
  // Mobile Money
  sendMobileMoneyPrompt: (paymentId: string, phoneNumber: string) => Promise<boolean>;
  
  // Card Management
  saveCard: (cardDetails: PaymentAPI.CardPaymentRequest['card_details']) => Promise<string>;
  fetchSavedCards: () => Promise<void>;
  deleteSavedCard: (cardToken: string) => Promise<boolean>;
  setDefaultCard: (cardToken: string) => Promise<void>;
  
  // Payment History
  fetchPaymentHistory: (page?: number, limit?: number) => Promise<void>;
  clearPaymentHistory: () => void;
  
  // Cart Integration
  setCartTotal: (total: number, currency?: string) => void;
  calculateFees: (amount: number, method: PaymentMethod) => number;
  
  // State Management
  clearError: () => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      // Initial State
      availableMethods: [],
      selectedMethod: null,
      currentPayment: null,
      paymentLoading: false,
      paymentError: null,
      paymentHistory: [],
      historyLoading: false,
      historyError: null,
      savedCards: [],
      cardsLoading: false,
      cardsError: null,
      cartTotal: 0,
      currency: 'RWF',

      // Payment Method Management
      fetchAvailableMethods: async () => {
        set({ paymentLoading: true, paymentError: null });
        try {
          const response = await PaymentAPI.getAvailablePaymentMethods();
          set({ 
            availableMethods: response.payment_methods,
            paymentLoading: false 
          });
        } catch (error: any) {
          set({ 
            paymentError: error.message || "Failed to fetch payment methods",
            paymentLoading: false 
          });
          throw error;
        }
      },

      selectPaymentMethod: (method: PaymentMethod) => {
        set({ selectedMethod: method });
      },

      // Payment Processing
      initiatePayment: async (paymentData: PaymentAPI.PaymentRequest) => {
        set({ paymentLoading: true, paymentError: null });
        try {
          const payment = await PaymentAPI.initiatePayment(paymentData);
          set({ 
            currentPayment: payment,
            paymentLoading: false 
          });
          return payment;
        } catch (error: any) {
          set({ 
            paymentError: error.message || "Payment initiation failed",
            paymentLoading: false 
          });
          throw error;
        }
      },

      verifyPayment: async (paymentId: string) => {
        try {
          const response = await PaymentAPI.verifyPayment(paymentId);
          if (response.verified) {
            // Update current payment status
            const { currentPayment } = get();
            if (currentPayment && currentPayment.payment_id === paymentId) {
              set({ 
                currentPayment: { ...currentPayment, status: 'completed' as PaymentStatus }
              });
            }
          }
          return response.verified;
        } catch (error: any) {
          set({ paymentError: error.message || "Payment verification failed" });
          return false;
        }
      },

      getPaymentStatus: async (paymentId: string) => {
        try {
          const payment = await PaymentAPI.getPaymentStatus(paymentId);
          set({ currentPayment: payment });
          return payment;
        } catch (error: any) {
          set({ paymentError: error.message || "Failed to get payment status" });
          throw error;
        }
      },

      cancelPayment: async (paymentId: string) => {
        try {
          const response = await PaymentAPI.cancelPayment(paymentId);
          if (response.success) {
            // Update current payment status
            const { currentPayment } = get();
            if (currentPayment && currentPayment.payment_id === paymentId) {
              set({ 
                currentPayment: { ...currentPayment, status: 'cancelled' as PaymentStatus }
              });
            }
          }
          return response.success;
        } catch (error: any) {
          set({ paymentError: error.message || "Failed to cancel payment" });
          return false;
        }
      },

      refundPayment: async (paymentId: string, amount?: number, reason?: string) => {
        try {
          const response = await PaymentAPI.refundPayment(paymentId, amount, reason);
          if (response.success) {
            // Update current payment status
            const { currentPayment } = get();
            if (currentPayment && currentPayment.payment_id === paymentId) {
              set({ 
                currentPayment: { ...currentPayment, status: 'refunded' as PaymentStatus }
              });
            }
          }
          return response.success;
        } catch (error: any) {
          set({ paymentError: error.message || "Failed to refund payment" });
          return false;
        }
      },

      // Mobile Money
      sendMobileMoneyPrompt: async (paymentId: string, phoneNumber: string) => {
        try {
          const response = await PaymentAPI.sendMobileMoneyPrompt(paymentId, phoneNumber);
          return response.success;
        } catch (error: any) {
          set({ paymentError: error.message || "Failed to send mobile money prompt" });
          return false;
        }
      },

      // Card Management
      saveCard: async (cardDetails: PaymentAPI.CardPaymentRequest['card_details']) => {
        if (!cardDetails) throw new Error("Card details are required");
        
        try {
          const response = await PaymentAPI.saveCard(cardDetails);
          if (response.success) {
            // Refresh saved cards
            await get().fetchSavedCards();
          }
          return response.card_token;
        } catch (error: any) {
          set({ cardsError: error.message || "Failed to save card" });
          throw error;
        }
      },

      fetchSavedCards: async () => {
        set({ cardsLoading: true, cardsError: null });
        try {
          const response = await PaymentAPI.getSavedCards();
          set({ 
            savedCards: response.cards,
            cardsLoading: false 
          });
        } catch (error: any) {
          set({ 
            cardsError: error.message || "Failed to fetch saved cards",
            cardsLoading: false 
          });
        }
      },

      deleteSavedCard: async (cardToken: string) => {
        try {
          const response = await PaymentAPI.deleteSavedCard(cardToken);
          if (response.success) {
            // Remove from local state
            const { savedCards } = get();
            set({ 
              savedCards: savedCards.filter(card => card.card_token !== cardToken)
            });
          }
          return response.success;
        } catch (error: any) {
          set({ cardsError: error.message || "Failed to delete card" });
          return false;
        }
      },

      setDefaultCard: async (cardToken: string) => {
        try {
          // Update local state to set default card
          const { savedCards } = get();
          const updatedCards = savedCards.map(card => ({
            ...card,
            is_default: card.card_token === cardToken
          }));
          set({ savedCards: updatedCards });
          
          // TODO: Call API to update default card on backend
        } catch (error: any) {
          set({ cardsError: error.message || "Failed to set default card" });
          throw error;
        }
      },

      // Payment History
      fetchPaymentHistory: async (page: number = 1, limit: number = 20) => {
        set({ historyLoading: true, historyError: null });
        try {
          const response = await PaymentAPI.getPaymentHistory(page, limit);
          set({ 
            paymentHistory: response.payments,
            historyLoading: false 
          });
        } catch (error: any) {
          set({ 
            historyError: error.message || "Failed to fetch payment history",
            historyLoading: false 
          });
        }
      },

      clearPaymentHistory: () => {
        set({ paymentHistory: [] });
      },

      // Cart Integration
      setCartTotal: (total: number, currency: string = 'RWF') => {
        set({ cartTotal: total, currency });
      },

      calculateFees: (amount: number, method: PaymentMethod) => {
        const { availableMethods } = get();
        const methodInfo = availableMethods.find(m => m.method === method);
        
        if (!methodInfo) return 0;
        
        let fees = 0;
        if (methodInfo.fees_percentage) {
          fees += (amount * methodInfo.fees_percentage) / 100;
        }
        if (methodInfo.fees_fixed) {
          fees += methodInfo.fees_fixed;
        }
        
        return fees;
      },

      // State Management
      clearError: () => {
        set({ 
          paymentError: null, 
          historyError: null, 
          cardsError: null 
        });
      },

      resetPayment: () => {
        set({ 
          currentPayment: null,
          selectedMethod: null,
          paymentError: null,
          cartTotal: 0
        });
      },
    }),
    {
      name: "agura-payment",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        availableMethods: state.availableMethods,
        selectedMethod: state.selectedMethod,
        savedCards: state.savedCards,
        currency: state.currency,
      }),
    }
  )
);
