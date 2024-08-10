import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { SelectOptionType } from '@/types/general';
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
interface ActivityLog {
  text: string;
  value: string;
  insertBy: string;
  insertDt: string;
  status: string;
}

interface ActivityLogResponse {
  data: ActivityLog[] | null;
  message: string;
  success: boolean;
}

interface ClientDetail {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  code: string;
  companyName: string;
  branchName: string;
  panNo: string;
  gstNo: string;
}

interface ClientResponse {
  data: ClientDetail[] | null;
  message: string;
  success: boolean;
}

interface Worker {
  employeeID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  DOB: string;
  DOBFile: {
    fileName: string;
    filePath: string;
  };
  gender: string;
  email: string;
  mobile: string;
  bloodGroup: string;
  aadhaarNo: string;
  aadhaarFile: {
    fileName: string;
    filePath: string;
  };
}

interface WorkersResponse {
  success: boolean;
  status: string;
  message: string;
  data: Worker[];
}

interface WorkersInfoResponse {
  success: boolean;
  status: string;
  message: string;
  data: [];
}

interface AdminPageState {
  companies: Company[] | null;
  department: Department[] | null;
  designation: Designation[] | null;
  marriedStatus: SelectOptionType[] | null;
  states: SelectOptionType[] | null;
  universityList: SelectOptionType[] | null;
  educationStatus: SelectOptionType[] | null;
  streams: SelectOptionType[] | null;
  clientList: ClientDetail[] | null;
  activityLogs: ActivityLog[] | null;
  workers: Worker[] | null;
  workerInfo: [] | null;
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminPageState = {
  companies: null,
  department: [],
  marriedStatus: [],
  designation: [],
  universityList: [],
  educationStatus: [],
  states: [],
  streams: [],
  clientList: [],
  activityLogs: [],
  workers: [],
  workerInfo: [],
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
export const searchCompanies = createAsyncThunk<CompanyResponse, void>(
  'homePage/searchCompanies',
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

export const fetchMarriedStatus = createAsyncThunk<DesignationResponse, void>(
  'homePage/fetchMarriedStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/marriedStatus`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch married status');
    }
  },
);

export const fetchStates = createAsyncThunk<DesignationResponse, void>(
  'homePage/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/states`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch states');
    }
  },
);
export const universitiesSearch = createAsyncThunk<DesignationResponse, void>(
  'homePage/universitiesSearch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/designations`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch universities');
    }
  },
);

export const getEducationStatus = createAsyncThunk<DesignationResponse, void>(
  'homePage/getEducationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/designations`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch educationStatus');
    }
  },
);

export const getStreams = createAsyncThunk<DesignationResponse, void>(
  'homePage/getStreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `${baseLink}fetch/streams?search=`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch streams');
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

export const fetchActivityLogs = createAsyncThunk<ActivityLogResponse, void>(
  'homePage/fetchActivityLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<ActivityLogResponse>(
        `${baseLink}fetch/uplodedEmployees`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const fetchClientList = createAsyncThunk<ClientResponse, void>(
  'homePage/fetchClientList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<ClientResponse>(
        `${baseLink}client/list`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const fetchWorkers = createAsyncThunk<
  WorkersResponse,
  { startDate: string; endDate: string }
>(
  'adminPage/fetchWorkers',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<WorkersResponse>(
        `https://esptest.mscorpres.net/worker/list?data=${startDate}-${endDate}&wise=createdDate`,
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
      return rejectWithValue('Failed to fetch workers');
    }
  },
);

export const bulkUpload = createAsyncThunk<void, File, { rejectValue: string }>(
  'adminPage/bulkUpload',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('uploadfile', file);
      const response = await orshAxios.post(
        baseLink + 'worker/upload',
        formData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to upload file');
    }
  },
);

export const fetchWorkerDetails = createAsyncThunk<WorkersInfoResponse, string>(
  'adminPage/fetchWorkerDetails',
  async (empId, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<WorkersInfoResponse>(
        baseLink + `fetch/employeeAllInfo?username=${empId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch workers');
    }
  },
);

export const deleteActivityLog = createAsyncThunk<void, string>(
  'adminPage/deleteActivityLog',
  async (fileId: string, { rejectWithValue }) => {
    try {
      await orshAxios.delete(baseLink + `worker/delete/file/${fileId}`);
    } catch (error) {
      return rejectWithValue('Failed to delete activity log');
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
      .addCase(searchCompanies.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.companies = action.payload.data;
      })
      .addCase(searchCompanies.rejected, (state, action) => {
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
      .addCase(fetchMarriedStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.marriedStatus = action.payload.data;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.states = action.payload.data;
      })
      .addCase(universitiesSearch.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.universityList = action.payload.data;
      })
      .addCase(getEducationStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.error = null;
        state.educationStatus = action.payload.data;
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
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.activityLogs = action.payload.data;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchClientList.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.clientList = action.payload.data;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.workers = action.payload.data; // Set the workers data
        state.error = null;
      })
      .addCase(fetchWorkerDetails.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.workers = [];
      })
      .addCase(fetchWorkerDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.workerInfo = action.payload.data;
        state.error = null;
      });
  },
});

export default adminPageSlice.reducer;
