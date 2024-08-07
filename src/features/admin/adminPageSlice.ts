import { orshAxios } from '@/axiosIntercepter';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseLink = 'https://esptest.mscorpres.net/';

interface AddCompanyPayload {
  email: string;
  mobile: string;
  name: string;
  panNo: string;
  website: string;
}

interface Company {
  name: string;
  companyID: string;
  panNo: string;
  email: string;
  mobile: string;
  website: string;
  activeStatus: string;
}
interface CompanyResponse {
  data: Company[] | null;
  message: string;
  success: boolean;
}

export interface Department {
  text: string;
  value: string;
}

interface DepartmentResponse {
  data: Department[] | null;
  message: string;
  success: boolean;
}

export interface Designation {
  text: string;
  value: string;
}

interface DesignationResponse {
  data: Designation[] | null;
  message: string;
  success: boolean;
}

interface AddWorkerPayload {
  empFirstName: string;
  empMiddleName: string;
  empLastName: string;
  empEmail: string;
  empDOB: string;
  empDepartment: string;
  empDesignation: string;
  empMobile: string;
  empPassword: string;
  empGender: string;
}

interface AdminPageState {
  companies: Company[] | null;
  department: Department[] | null;
  designation: Designation[] | null;
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminPageState = {
  companies: null,
  department: [],
  designation: [],
  loading: 'idle',
  error: null,
};

// Define the async thunk for adding a company
export const addCompany = createAsyncThunk(
  'adminPage/addCompany',
  async (companyData: AddCompanyPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post(
        baseLink + 'company/add',
        companyData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

// Define the async thunk for fetching companies
export const fetchCompanies = createAsyncThunk<CompanyResponse, void>(
  'homePage/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<CompanyResponse>(
        `${baseLink}company/list`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch companies');
    }
  },
);

export const fetchDepartments = createAsyncThunk<DepartmentResponse, void>(
  'homePage/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DepartmentResponse>(
        `${baseLink}fetch/departments`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch departments');
    }
  },
);

export const fetchDesignations = createAsyncThunk<DesignationResponse, void>(
  'homePage/fetchDesignations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/designations`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const addWorker = createAsyncThunk(
  'adminPage/addworker',
  async (workerData: AddWorkerPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post(
        baseLink + 'worker/add',
        workerData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

// Create the slice
const adminPageSlice = createSlice({
  name: 'adminPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCompany.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.companies = action.payload.data;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.department = action.payload.data;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.designation = action.payload.data;
      })
      .addCase(addWorker.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(addWorker.fulfilled, (state) => {
        state.loading = 'succeeded';
        state.error = null;
      })
      .addCase(addWorker.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default adminPageSlice.reducer;
