import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventsState {
    events: any[];
    selectedCategories: string[];
}

const initialState: EventsState = {
    events: [],
    selectedCategories: [],
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<any[]>) {
            state.events = action.payload;
        },
        setSelectedCategories(state, action: PayloadAction<string[]>) {
            state.selectedCategories = action.payload;
        },
    },
});

export const { setEvents, setSelectedCategories } = eventsSlice.actions;
export default eventsSlice.reducer;
