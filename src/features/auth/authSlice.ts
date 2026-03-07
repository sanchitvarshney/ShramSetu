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

function getInitialAuthState(): AuthState {
  try {
    const stored = localStorage.getItem('loggedInUser');
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.token) return { user, error: null, loading: false };
    }
  } catch {
    // ignore
  }
  return { user: null, error: null, loading: false };
}

const initialState: AuthState = getInitialAuthState();

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

/** Forgot password: send reset link/OTP to email or phone */
export const forgotPassword = createAsyncThunk<
  { success: boolean; message: string },
  { userName: string }
>('auth/forgotPassword', async ({ userName }, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('login/forgot-password', {
      userName: userName.trim(),
    });
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to send reset link',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({ title: 'Success', description: data.message || 'Check your email for reset instructions.' });
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to send reset link';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

/** Send OTP for forgot password (admin or client) */
export const sendOtp = createAsyncThunk<
  { success: boolean; message: string },
  { type: 'admin' | 'client'; userName: string }
>('auth/sendOtp', async ({ type, userName }, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('/login/sendOtp', {
      type,
      email: userName.trim(),
    });
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to send OTP',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({ title: 'Success', description: data.message || 'OTP sent to your email.' });
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to send OTP';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

/** Change password after OTP verification (forgot password flow) */
export const changePasswordForgot = createAsyncThunk<
  { success: boolean; message: string },
  { type: 'admin' | 'client'; userName: string; otp: string; newPassword: string }
>('auth/changePasswordForgot', async ({ type, userName, otp, newPassword }, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('/login/changePassword', {
      type,
      email: userName.trim(),
      otp: otp.trim(),
      newPassword,
    });
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to change password',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({ title: 'Success', description: data.message || 'Password changed successfully.' });
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to change password';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

/** Reset password with token from email link */
export const resetPassword = createAsyncThunk<
  { success: boolean; message: string },
  { token: string; newPassword: string }
>('auth/resetPassword', async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('login/reset-password', {
      token,
      newPassword,
    });
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to reset password',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({ title: 'Success', description: data.message || 'Password reset successfully.' });
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to reset password';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

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
    setUserFromStorage(state, action) {
      if (action.payload) {
        state.user = action.payload;
      }
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
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordForgot.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePasswordForgot.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordForgot.rejected, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
