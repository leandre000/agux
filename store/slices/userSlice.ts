import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    username?: string;
    gender?: string;
    profileImage?: string;
    categories?: string[];
}

const initialState: UserProfile = {
    username: '',
    gender: '',
    profileImage: '',
    categories: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<UserProfile>) {
            return { ...state, ...action.payload };
        },
        setCategories(state, action: PayloadAction<string[]>) {
            state.categories = action.payload;
        },
        setProfileImage(state, action: PayloadAction<string>) {
            state.profileImage = action.payload;
        },
    },
});

export const { setProfile, setCategories, setProfileImage } = userSlice.actions;
export default userSlice.reducer;
