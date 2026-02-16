import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { Industry, IndustryResponse } from '@/features/admin/adminPageSlice';
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

interface CVResponse {
  data: string;
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
  topSearchCompanies: SearchCompany[] | null;
  selectedCompany: Company | null;
  stateSearch: Company[] | null;
  districtSearch: Company[] | null;
  industrySearch: Industry[] | null;
  gender: Company[] | null;
  error: string | null;
  advancedFilter: AdvancedFilterPayload[] | null;
  notifications: Notification[] | null;
  loading: boolean;
  locationData: any[];
}

const initialState: HomePageState = {
  companies: [],
  searchCompanies: [],
  topSearchCompanies: [],
  stateSearch: [],
  districtSearch: [],
  industrySearch: [],
  gender: [],
  selectedCompany: null,
  error: null,
  advancedFilter: [],
  notifications: null,
  loading: false,
  locationData: [],
};

export const presentState = createAsyncThunk<CompanyResponse, void>(
  'fetch/empPresentState',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CompanyResponse>(
        '/fetch/empPresentState',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch states');
    }
  },
);

export const presentDistrict = createAsyncThunk<CompanyResponse, void>(
  'homePage/presentDistrict',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CompanyResponse>(
        '/fetch/empPresentDistrict?search=',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch districts');
    }
  },
);

export const presentIndustry = createAsyncThunk<IndustryResponse, void>(
  'homePage/fetchIndustries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<IndustryResponse>(
        '/industry/industry?search=',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch industries');
    }
  },
);

export const genderSearch = createAsyncThunk<CompanyResponse, void>(
  'homePage/genderSearch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CompanyResponse>(
        '/fetch/genders?search=',
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch genders');
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

export const getCV = createAsyncThunk<CVResponse, string>(
  'adminPage/getCV',
  async (empId, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CVResponse>(
        `/worker/resumeDownload/${empId}`,
      );
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error Occurred',
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch link');
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

export const fetchTopSearchCompanies = createAsyncThunk<SearchCompany[]>(
  'homePage/topSearchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get(`/company/topSearch`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch top search companies');
    }
  },
);

export const advancedFilter = createAsyncThunk(
  'adminPage/advancedFilter',
  async (companyData: AdvancedFilterPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post(
        '/job/advance-search',
        companyData,
      );
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to apply advanced filter');
    }
  },
);


export const getLocations = createAsyncThunk<
  any,
  { search?: string }
>('homePage/getLocations', async (payload) => {
  const search = payload?.search ?? '';
  const response = await orshAxios.get(`/job/filterJobLocation?search=${encodeURIComponent(search)}`);
  return response?.data;
});

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
      .addCase(presentState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(presentState.fulfilled, (state, action) => {
        state.loading = false;
        state.stateSearch = action.payload.data;
        state.error = null;
      })
      .addCase(presentState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(presentDistrict.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(presentDistrict.fulfilled, (state, action) => {
        state.loading = false;
        state.districtSearch = action.payload.data;
        state.error = null;
      })
      .addCase(presentDistrict.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(presentIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(presentIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.industrySearch = action.payload.data;
        state.error = null;
      })
      .addCase(presentIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(genderSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(genderSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.gender = action.payload.data;
        state.error = null;
      })
      .addCase(genderSearch.rejected, (state, action) => {
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
      .addCase(fetchTopSearchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSearchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.topSearchCompanies = action.payload;
        state.error = null;
      })
      .addCase(fetchTopSearchCompanies.rejected, (state, action) => {
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
      .addCase(getCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCV.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getCV.rejected, (state, action) => {
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
      })
       .addCase(getLocations.pending, (state) => {
       
        state.error = null;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
      
        state.locationData = action.payload.data;
        state.error = null;
      })
      .addCase(getLocations.rejected, (state, action) => {
        
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
