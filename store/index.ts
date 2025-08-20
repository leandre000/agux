import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';
import userReducer from './slices/userSlice';

export { useAuthStore } from './auth-store';
export { useEventsStore } from './events-store';
export { useOrdersStore } from './orders-store';
export { usePaymentStore } from './payment-store';
export { useTicketsStore } from './tickets-store';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        events: eventsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
