import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define types
interface AuthState {
  user: LoginResponseData | null; // Add user property to store login data
  error: string | null;
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface LoginCredentials {
  userName: string;
  password: string;
}

const initialState: AuthState = {
  user: null, // Initialize with null
  error: null,
  loading: 'idle',
};

interface LoginResponseData {
  id: string;
  email: string;
  mobile: string;
  firstName: string;
  middleName: string;
  lastName: string;
  type: string;
  token: string;
}
interface LoginResponse {
  data: LoginResponseData | null;
  message: string;
  status: string;
  success: boolean;
}

// Define the async thunk for login
export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('login/admin', credentials);
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      }
      return response.data; // Return only the user data part
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  },
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = 'idle';
      // localStorage.removeItem('loggedInUser'); // Clear user data from local storage
      // localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.user = action.payload.data; // Save user data to state
        // Optionally store user data in localStorage
        action.payload.success &&
          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(action.payload.data),
          );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string; // Ensure payload is a string
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
