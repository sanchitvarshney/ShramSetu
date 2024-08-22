import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the state interface
interface ProfileState {
  userProfile: any[];
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define initial state
const initialState: ProfileState = {
  userProfile: [],
  loading: 'idle',
  error: null,
};

// Create async thunk for changing the password
export const changePassword = createAsyncThunk(
  'profilePage/changePassword',
  async (
    { body, type }: { body: object; type: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await orshAxios.post(
        `/admin/change-password?${type}`,
        body,
      );
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
        return rejectWithValue(response.data.message);
      } else {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to change password');
    }
  },
);

export const sentOtp = createAsyncThunk(
  'adminPage/sentOtp',
  async (
    { body, type }: { body: object; type: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await orshAxios.post(`/admin/sendOtp?${type}`, body);
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
        return rejectWithValue(response.data.message);
      } else {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'adminPage/sentOtp',
  async (
    { body, type }: { body: object; type: string },
    { rejectWithValue },
  ) => {
    try {
        console.log(type,body)
      const response = await orshAxios.post(`/admin/verifyOtp?${type}`, body);
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
        return rejectWithValue(response.data.message);
      } else {
        toast({
          title: 'Success',
          description: response.data.message,
        });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

// Create async thunk for fetching the user profile
export const fetchUserProfile = createAsyncThunk(
  'profilePage/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get(`/admin/profile`);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
    }
  },
);

// Create the slice
const profilePageSlice = createSlice({
  name: 'profilePage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchUserProfile actions
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default profilePageSlice.reducer;
