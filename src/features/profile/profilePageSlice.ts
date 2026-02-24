import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the state interface
interface ProfileState {
  userProfile: any[];
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: ProfileState = {
  userProfile: [],
  loading: false,
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
  async ({ body }: { body: object }, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post(`/admin/verifyOtp`, body);
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

/** Normalize API value: strip surrounding quotes from placeholders like "'--'" */
function normalizeProfileValue(val: unknown): string {
  if (val == null) return '';
  const s = String(val).trim();
  if (s === "'--'" || s === '"--"' || s === "''" || s === '""') return '--';
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

/** Treat '--', null, undefined, 'false' as false; only true or 'true' as true */
function toVerifyBoolean(val: unknown): boolean {
  if (val === true || val === 'true') return true;
  return false;
}

/** Map API/query shape to profile shape: name, nameOfCompany, email, phoneNumber, emailSupport, emailRecruitment, emailVerify, supportEmailVerify, recruitmentEmailVerify */
function normalizeProfilePayload(payload: unknown): any[] {
  const raw = Array.isArray(payload) ? payload[0] ?? {} : payload ?? {};
  const obj = typeof raw === 'object' && raw !== null ? raw : {};
  const name =
    normalizeProfileValue(obj.name) ||
    [obj.firstName, obj.lastName].filter(Boolean).join(' ').trim() ||
    obj.name;
  const nameOfCompany = (normalizeProfileValue(obj.nameOfCompany) || obj.nameOfCompany) ?? '--';
  const email = (normalizeProfileValue(obj.email) || obj.email) ?? '';
  const phoneNumber = (normalizeProfileValue(obj.phoneNumber) || obj.mobile || obj.phoneNumber) ?? '';
  const emailSupport = (normalizeProfileValue(obj.emailSupport) || obj.supportEmail || obj.emailSupport) ?? '--';
  const emailRecruitment = (normalizeProfileValue(obj.emailRecruitment) || obj.recruitmentEmail || obj.emailRecruitment) ?? '--';
  const emailVerify = toVerifyBoolean(obj.emailVerify ?? obj.isVerified);
  const supportEmailVerify = toVerifyBoolean(obj.supportEmailVerify ?? obj.isSupportEmail);
  const recruitmentEmailVerify = toVerifyBoolean(obj.recruitmentEmailVerify ?? obj.isRecruitmentEmail);

  const normalized = {
    ...obj,
    name,
    nameOfCompany,
    email,
    phoneNumber,
    emailSupport,
    emailRecruitment,
    emailVerify,
    supportEmailVerify,
    recruitmentEmailVerify,
    phoneVerify: toVerifyBoolean(obj.phoneVerify ?? obj.mobileVerify),
  };
  return [normalized];
}

// Create async thunk for fetching the user profile
export const fetchUserProfile = createAsyncThunk(
  'profilePage/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get(`/admin/profile`);
      return normalizeProfilePayload(response.data?.data);
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profilePageSlice.reducer;
