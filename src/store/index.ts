import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Adjust path as needed
import homePageSlice from '@/features/homePage/homePageSlice';
import adminPageSlice from '@/features/admin/adminPageSlice';
import profilePageSlice from '@/features/profile/profilePageSlice';
import jobSlice from '@/features/jobFeatures/jobsSlices';
import jobApplicationsSlice from '@/features/jobFeatures/jobApplicationsSlice';

export const store:any = configureStore({
  reducer: {
    auth: authReducer,
    homePage: homePageSlice,
    adminPage:adminPageSlice,
    profilePage:profilePageSlice,
    jobslice:jobSlice,
    jobApplications: jobApplicationsSlice,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
