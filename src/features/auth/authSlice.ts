import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define types
interface AuthState {
  user: LoginResponseData | null; 
  error: string | null;
  loading: boolean
}

interface LoginCredentials {
  userName: string;
  password: string;
  type: string;
}

const initialState: AuthState = {
  user: null, // Initialize with null
  error: null,
  loading: false
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
      const response = await orshAxios.post('login/signin', credentials);
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

      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('companySelect');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload as string; // Ensure payload is a string
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
