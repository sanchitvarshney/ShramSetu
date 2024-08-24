import { orshAxios } from '@/axiosIntercepter';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define types
export interface Company {
  text: string;
  value: string;
}

export interface Notification {
  title: string;
  message: string;
  type: string;
  notiInsertedAt: string;
}

export interface NotificationResponse {
  success: string;
  status: string;
  data: Notification[] | null;
}
interface CompanyResponse {
  data: Company[];
  status: string;
  success: boolean;
}

export interface SearchCompany {
  name: string;
  panNo: string;
  website: string;
  createdOn: string;
  updatedOn: string;
  srNo: string;
  companyID: string;
}

export interface AdvancedFilterPayload {
  companies: string[];
  excludePreviousCompany: boolean;
  excludePreviousIndustry: boolean;
  limit: number;
}

interface HomePageState {
  companies: Company[] | null;
  searchCompanies: SearchCompany[] | null;
  selectedCompany: Company | null;
  error: string | null;
  advancedFilter: AdvancedFilterPayload[] | null;
  notifications: NotificationResponse[] | null;
  loading: boolean;
}

const initialState: HomePageState = {
  companies: [],
  searchCompanies: [],
  selectedCompany: null,
  error: null,
  advancedFilter: [],
  notifications: [],
  loading: false,
};

export const fetchCompanies = createAsyncThunk<CompanyResponse, void>(
  'homePage/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CompanyResponse>(
        '/fetch/companyList',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch companies');
    }
  },
);

export const fetchNotifications = createAsyncThunk<NotificationResponse, void>(
  'homePage/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<NotificationResponse>(
        '/fetch/notifications',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch notifications');
    }
  },
);

export const fetchSearchCompanies = createAsyncThunk<SearchCompany[]>(
  'homePage/searchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get(`/company/company?search=`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch search companies');
    }
  },
);

export const advancedFilter = createAsyncThunk(
  'adminPage/advancedFilter',
  async (companyData: AdvancedFilterPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post(
        '/fetch/advancedFilter',
        companyData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to apply advanced filter');
    }
  },
);

const homePageSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    selectCompany(state, action: { payload: Company }) {
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany(state) {
      state.selectedCompany = null;
    },
    clearCompanyError(state) {
      state.error = null;
    },
    clearSearchCompanies(state) {
      state.searchCompanies = null;
    },
    clearLoading(state) {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSearchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchCompanies = action.payload;
        state.error = null;
      })
      .addCase(fetchSearchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(advancedFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(advancedFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.advancedFilter = action.payload.data;
        state.error = null;
      })
      .addCase(advancedFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectCompany,
  clearSelectedCompany,
  clearCompanyError,
  clearSearchCompanies,
  clearLoading,
} = homePageSlice.actions;
export default homePageSlice.reducer;
