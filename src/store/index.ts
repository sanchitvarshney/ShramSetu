import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Adjust path as needed
import homePageSlice from '@/features/homePage/homePageSlice';
import adminPageSlice from '@/features/admin/adminPageSlice';
import profilePageSlice from '@/features/profile/profilePageSlice';

export const store:any = configureStore({
  reducer: {
    auth: authReducer,
    homePage: homePageSlice,
    adminPage:adminPageSlice,
    profilePage:profilePageSlice,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
