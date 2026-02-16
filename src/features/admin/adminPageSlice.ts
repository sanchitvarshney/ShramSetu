import { orshAxios } from '@/axiosIntercepter';
import { toast } from '@/components/ui/use-toast';
import { UpdateEmployeeResponse } from '@/features/admin/adminPageTypes';
import { SelectOptionType } from '@/types/general';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AddCompanyPayload {
  brandName?: string;
  branchName?: string;
  email: string;
  hsn?: string[];
  mobile: string;
  name: string;
  panNo: string;
  ssc?: string[];
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

export interface Industry {
  name: string;
  industryID: string;
}

export interface SubIndustry {
  name: string;
  subIndustryID: string;
}

interface DepartmentResponse {
  data: any[] | null;
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

export interface IndustryResponse {
  data: Industry[] | null;
  message: string;
  success: boolean;
}

interface SubIndustryResponse {
  data: SubIndustry[] | null;
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

interface BranchDetail {
  branchID: string;
  branchName: string;
  city: string;
  companyID: string;
  companyName: string;
  email: string;
  gst: string;
}

interface BranchInfoResponse {
  success: boolean;
  status: string;
  message: string;
  data: BranchDetail[] | null;
}

interface PinCode {
  block: string;
  branchType: string;
  circle: string;
  country: string;
  deliveryStatus: string;
  description: string;
  district: string;
  division: string;
  name: string;
  pinCode: string;
  region: string;
  state: string;
}

interface PincodeResponse {
  success: boolean;
  status: string;
  message: string;
  data: PinCode[] | null;
}

interface AdminPageState {
  companies: Company[] | null;
  department: Department[] | null;
  designation: Designation[] | null;
  industry: Industry[] | null;
  marriedStatus: SelectOptionType[] | null;
  states: SelectOptionType[] | null;
  universityList: SelectOptionType[] | null;
  educationStatus: SelectOptionType[] | null;
  streams: SelectOptionType[] | null;
  clientList: ClientDetail[] | null;
  activityLogs: ActivityLog[] | null;
  branches: BranchDetail[] | null;
  workers: Worker[] | null;
  workersStatusCount: [] | null;
  corPincode: PinCode[] | null;
  perPincode: PinCode[] | null;
  workerInfo: [] | null;
  subIndustry: SubIndustry[] | null;
  companyInfo: BranchDetail[] | null;
  loading: boolean;
  error: string | null;
  isFetchingJobsLoading: boolean;
  adduserloading: boolean;
  addcompanyLoading: boolean;
  iseditcompany: boolean;
  addDepartmentLoading: boolean;
  addDesignationLoading: boolean;
}

const initialState: AdminPageState = {
  companies: null,
  department: [],
  marriedStatus: [],
  designation: [],
  industry: [],
  universityList: [],
  educationStatus: [],
  states: [],
  streams: [],
  clientList: [],
  activityLogs: [],
  workers: [],
  workersStatusCount: [],
  branches: [],
  workerInfo: [],
  companyInfo: [],
  subIndustry: [],
  corPincode: [],
  perPincode: [],
  loading: false,
  error: null,
  isFetchingJobsLoading: false,
  adduserloading: false,
  addcompanyLoading: false,
  iseditcompany: false,
  addDepartmentLoading: false,
  addDesignationLoading: false,
};



// Define the async thunk for adding a company
export const addCompany = createAsyncThunk(
  'adminPage/addCompany',
  async (companyData: AddCompanyPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('/company/add', companyData);
      return response?.data;
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

export const addClient = createAsyncThunk(
  'adminPage/addClient',
  async (clientData: {}, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('/client/add', clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add client');
    }
  },
);

// Define the async thunk for fetching companies (type = logged-in user type: admin | client)
export const searchCompanies = createAsyncThunk<
  CompanyResponse,
  string | undefined
>(
  'adminPage/searchCompanies',
  async (type, { rejectWithValue }) => {
    console.log(type,"quary")
    try {
      const queryType = type ?? 'admin';
      const response = await orshAxios.get<CompanyResponse>(
        `/company/list?type=${queryType}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch companies');
    }
  },
);

export const fetchDepartments = createAsyncThunk<DepartmentResponse, void>(
  'adminPage/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DepartmentResponse>(
        `/fetch/departments`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch departments');
    }
  },
);

export const fetchIndustry = createAsyncThunk<IndustryResponse, void>(
  'adminPage/fetchIndustry',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<IndustryResponse>(`/fetch/industry`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch industries');
    }
  },
);

export const fetchDesignations = createAsyncThunk<DesignationResponse, void>(
  'adminPage/fetchDesignations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `/fetch/designations`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const addDepartment = createAsyncThunk<
  { success: boolean; message: string; data?: Department | null },
  { departmentName: any },
  { rejectValue: string }
>(
  'adminPage/addDepartment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('/fetch/addDepartment', payload);
      return response?.data ?? { success: false, message: 'No response' };
    } catch (error) {
      return rejectWithValue('Failed to add department');
    }
  },
);

export const addDesignation = createAsyncThunk<
  { success: boolean; message: string; data?: Designation | null },
  { designationName: string },
  { rejectValue: string }
>(
  'adminPage/addDesignation',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('/fetch/addDesignation', payload);
      return response?.data ?? { success: false, message: 'No response' };
    } catch (error) {
      return rejectWithValue('Failed to add designation');
    }
  },
);

export const fetchMarriedStatus = createAsyncThunk<DesignationResponse, void>(
  'adminPage/fetchMarriedStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `/fetch/marriedStatus`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch married status');
    }
  },
);

export const fetchStates = createAsyncThunk<DesignationResponse, void>(
  'adminPage/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `/fetch/states`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch states');
    }
  },
);
export const universitiesSearch = createAsyncThunk<DesignationResponse, void>(
  'adminPage/universitiesSearch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `/fetch/university?search=`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch universities');
    }
  },
);

export const getEducationStatus = createAsyncThunk<DesignationResponse, void>(
  'adminPage/getEducationStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `/fetch/getEducationStatus`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch educationStatus');
    }
  },
);

export const updateEmployeeDetails = createAsyncThunk<
  UpdateEmployeeResponse,
  any,
  { rejectValue: string }
>(
  'adminPage/updateEmployeeDetails',
  async (employeeData: any, { rejectWithValue }) => {
    try {
      const response = await orshAxios.put('/worker/update', employeeData);
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      } else {
        toast({
          title: 'Success',
          description: response.data.message,
        });
      }
      return response.data.add;
    } catch (error) {
      return rejectWithValue('Failed to fetch employee');
    }
  },
);

export const companyUpdate = createAsyncThunk<
  UpdateEmployeeResponse,
  any,
  { rejectValue: string }
>('adminPage/companyUpdate', async (companyData: any, { rejectWithValue }) => {
  try {
    const response = await orshAxios.put('/company/edit', companyData);
   
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch employee');
  }
});
export const branchUpdate = createAsyncThunk<
  UpdateEmployeeResponse,
  any,
  { rejectValue: string }
>('adminPage/branchupdate', async (companyData: any, { rejectWithValue }) => {
  try {
    const response = await orshAxios.put('/company/edit/branch', companyData);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch employee');
  }
});

export const getStreams = createAsyncThunk<DesignationResponse, void>(
  'adminPage/getStreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<DesignationResponse>(
        `fetch/streams?search=`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch streams');
    }
  },
);

export const handleEmpStatus = createAsyncThunk(
  'adminPage/handleEmpStatus',
  async (workerData: any, { rejectWithValue }) => {
    try {
      const response = await orshAxios.put(
        '/worker/updateMasterStatus',
        workerData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update status');
    }
  },
);

// export const addWorker = createAsyncThunk(
//   'adminPage/addworker',
//   async (workerData: AddWorkerPayload, { rejectWithValue }) => {
//     try {
//       const response = await orshAxios.post('/worker/add', workerData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue('Failed to add company');
//     }
//   },
// );

export const addWorker = createAsyncThunk(
  'adminPage/user-add',
  async (workerData: FormData, { rejectWithValue }) => {
    try {
      // Make sure to pass formData as the request body
      const response = await orshAxios.post('/worker/add-user', workerData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      return response.data;
    } catch (error) {
      console.log(error,"error")
      return rejectWithValue('Failed to add worker');
    }
  },
);

export const addBranch = createAsyncThunk(
  'adminPage/addworker',
  async (workerData: AddWorkerPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post('/company/add/branch', workerData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add company');
    }
  },
);

export const fetchActivityLogs = createAsyncThunk<ActivityLogResponse, void>(
  'adminPage/fetchActivityLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<ActivityLogResponse>(
        `/fetch/uplodedEmployees`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const fetchClientList = createAsyncThunk<ClientResponse, void>(
  'adminPage/fetchClientList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<ClientResponse>(`/client/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch designations');
    }
  },
);

export const fetchWorkers = createAsyncThunk<
  WorkersResponse,
  { startDate: string; endDate: string;}
>(
  'adminPage/fetchWorkers',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<WorkersResponse>(
        `/worker/list?data=${startDate}-${endDate}`,
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
export const fetchCountStatus = createAsyncThunk<any, void>(
  'adminPage/fetchCountStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<any>(`/worker/count`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch universities');
    }
  },
);
export const fetchJobs = createAsyncThunk<any, void>(
  'adminPage/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<any>(`/job/getJobs`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch universities');
    }
  },
);

interface CreateJobPayload {
  company: string;
  branch: string;
  jobType: string;
  designation: string;
  department: string;
  minSalary: number;
  maxSalary: number;
  skills: string;
  jobTitle: string;
  qualification: string;
  experience: string;
  jobStatus: string;
  jobDescription: string;
}

interface CreateJobResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createJob = createAsyncThunk<CreateJobResponse, CreateJobPayload>(
  'adminPage/createJob',
  async (jobData: CreateJobPayload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.post<CreateJobResponse>(
        '/job/createJob',
        jobData,
      );
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create job';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      return rejectWithValue(errorMessage);
    }
  },
);
export const bulkUpload = createAsyncThunk<void, File, { rejectValue: string }>(
  'adminPage/bulkUpload',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('uploadfile', file);
      const response = await orshAxios.post('/worker/upload', formData);
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
        `/fetch/employeeAllInfo?username=${empId}`,
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

export const fetchSubIndustry = createAsyncThunk<SubIndustryResponse, string>(
  'adminPage/fetchSubIndustry',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<SubIndustryResponse>(
        `/industry/subIndustrys?industryID=${id}`,
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

export const getCompanyBranchOptions = createAsyncThunk<
  BranchInfoResponse,
  string
>(
  'adminPage/getCompanyBranchOptions',
  async (companyID, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<BranchInfoResponse>(
        `/company/branches?companyID=${companyID}`,
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

export const getCompanyInfo = createAsyncThunk<BranchInfoResponse, string>(
  'adminPage/getCompanyInfo',
  async (companyID, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<BranchInfoResponse>(
        `/company/getDetails?companyID=${companyID}`,
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

interface GetLocationsParams {
  pinCode: string;
  addressType: 'permanent' | 'corresponding';
}

interface GetLocationsSuccessPayload {
  data: PinCode[] | null;
  addressType: 'permanent' | 'corresponding';
}

export const getLocationsFromPinCode = createAsyncThunk<
  GetLocationsSuccessPayload,
  GetLocationsParams
>(
  'adminPage/getLocationsFromPinCode',
  async ({ pinCode, addressType }, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<PincodeResponse>(
        `/fetch/pinCodeDetails?pincode=${pinCode}`,
      );
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
        return rejectWithValue(response.data.message);
      }
      return { data: response.data.data, addressType };
    } catch (error) {
      return rejectWithValue('Failed to fetch workers');
    }
  },
);

export const deleteActivityLog = createAsyncThunk<void, string>(
  'adminPage/deleteActivityLog',
  async (fileId: string, { rejectWithValue }) => {
    try {
      await orshAxios.delete(`/worker/delete/file/${fileId}`);
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
         .addCase(fetchJobs.pending, (state) => {
        state.isFetchingJobsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state) => {
        state.isFetchingJobsLoading = false;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isFetchingJobsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCompany.pending, (state) => {
        state.addcompanyLoading = true;
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state) => {
        state.addcompanyLoading = false;
        state.error = null;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.addcompanyLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.companies = action.payload.data;
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.department = action.payload.data;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.industry = action.payload.data;
      })
      .addCase(fetchIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.designation = action.payload.data;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDepartment.pending, (state) => {
        state.addDepartmentLoading = true;
        state.error = null;
      })
      .addCase(addDepartment.fulfilled, (state) => {
        state.addDepartmentLoading = false;
        state.error = null;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.addDepartmentLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addDesignation.pending, (state) => {
        state.addDesignationLoading = true;
        state.error = null;
      })
      .addCase(addDesignation.fulfilled, (state) => {
        state.addDesignationLoading = false;
        state.error = null;
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.addDesignationLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMarriedStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarriedStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.marriedStatus = action.payload.data;
      })
      .addCase(fetchMarriedStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.states = action.payload.data;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(universitiesSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(universitiesSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.universityList = action.payload.data;
      })
      .addCase(universitiesSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getEducationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEducationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.educationStatus = action.payload.data;
      })
      .addCase(getEducationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addWorker.pending, (state) => {
        state.adduserloading = true;
        state.error = null;
      })
      .addCase(addWorker.fulfilled, (state) => {
        state.adduserloading = false;
        state.error = null;
      })
      .addCase(addWorker.rejected, (state, action) => {
        state.adduserloading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activityLogs = action.payload.data;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClientList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.clientList = action.payload.data;
      })
      .addCase(fetchClientList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.workers = action.payload.data;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCountStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.workersStatusCount = action.payload.data;
      })
      .addCase(fetchCountStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getStreams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.streams = action.payload.data;
      })
      .addCase(getStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWorkerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.workerInfo = action.payload.data;
      })
      .addCase(fetchWorkerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.workerInfo = [];
      })
      .addCase(fetchSubIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.subIndustry = action.payload.data;
      })
      .addCase(fetchSubIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCompanyBranchOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyBranchOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.branches = action.payload.data;
      })
      .addCase(getCompanyBranchOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.branches = [];
      })
      .addCase(getCompanyInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanyInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.companyInfo = action.payload.data;
      })
      .addCase(getCompanyInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLocationsFromPinCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocationsFromPinCode.fulfilled, (state, action) => {
        state.loading = false;
        const { addressType, data } = action.payload;
        if (addressType === 'corresponding') {
          state.corPincode = data;
        } else if (addressType === 'permanent') {
          state.perPincode = data;
        }
        state.error = null;
      })
      .addCase(getLocationsFromPinCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(companyUpdate.pending, (state) => {
        state.iseditcompany = true;
        state.error = null;
      })
      .addCase(companyUpdate.fulfilled, (state) => {
        state.iseditcompany = false;
     
   
        state.error = null;
      })
      .addCase(companyUpdate.rejected, (state, action) => {
        state.iseditcompany = false;
        state.error = action.payload as string;
      });

  },
});

export default adminPageSlice.reducer;
