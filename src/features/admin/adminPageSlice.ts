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
interface MergePendingCompaniesPayload {
  targetId: string[];
  onldCompany?: string;
  newCompany?: string;
}
interface MergePendingCompaniesResponse {
  success: boolean;
  message: string;
  data?: unknown;
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

/** Response shape from GET /worker/details/:key */
export interface WorkerDetailsApiResponse {
  personalDetails?: {
    perma_pincode?: string;
    perma_state?: string;
    perma_city?: string;
    perma_district?: string;
    perma_houseNo?: string;
    perma_colony?: string;
    perma_country?: string;
    present_pincode?: string;
    present_state?: string;
    present_district?: string;
    present_city?: string;
    present_houseNo?: string;
    present_colony?: string;
    present_country?: string;
    dob?: string;
    empHobbies?: string;
    empMaritalStatus?: string;
    gender?: string;
  };
  employeementDetails?: Record<string, unknown> | unknown[];
  basicDetails?: {
    empCode?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    empEmail?: string;
    empPhone?: string;
    adhaar?: string;
    /** Photo URL or array of URLs (e.g. S3 signed URL) */
    empPhoto?: string | string[];
  };
  educationDetails?: Array<{
    empCode?: string;
    employeeDegree?: string;
    employeeStream?: string;
    employeeUniversity?: string;
    startYear?: string;
    endYear?: string;
    percentage?: string;
    educationType?: string;
    educationCertificate?: string;
    educationID?: string;
  }>;
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

export interface Contractor {
  contractorID: string;
  name: string;
  panNo: string;
  email: string;
  mobile: string;
  contactMobile?: string;
  contactName?: string;
  /** @deprecated use contactMobile - kept for API backward compatibility */
  mobile2?: string;
  /** @deprecated use contactName - kept for API backward compatibility */
  mobile2Name?: string;
  gst?: string;
  address?: string;
  activeStatus?: string;
}

interface ContractorListResponse {
  success: boolean;
  message?: string;
  data: Contractor[] | null;
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
  corPincode: PinCode[] | null;
  perPincode: PinCode[] | null;
  workerInfo: [] | null;
  subIndustry: SubIndustry[] | null;
  companyInfo: BranchDetail[] | null;
  contractors: Contractor[] | null;
  contractorLoading: boolean;
  addContractorLoading: boolean;
  loading: boolean;
  error: string | null;
  isFetchingJobsLoading: boolean;
  adduserloading: boolean;
  addcompanyLoading: boolean;
  iseditcompany: boolean;
  addDepartmentLoading: boolean;
  addDesignationLoading: boolean;
  isaddbranch: boolean;
  isbranchUpdate: boolean;
  loadingworkerlist: boolean;
  loadingCompaniesList: boolean;
  loadingCompanyInfo: boolean;
  loadingCompanyBranches: boolean;
  loadingJob: boolean;
  jobsList: any[] | null;
  pendingCompanies: Company[] | null;
  pendingCompLoading: boolean;
  mergeCompanyLoading: boolean;
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
  branches: [],
  workerInfo: [],
  companyInfo: [],
  subIndustry: [],
  corPincode: [],
  perPincode: [],
  contractors: null,
  contractorLoading: false,
  addContractorLoading: false,
  loading: false,
  error: null,
  isFetchingJobsLoading: false,
  adduserloading: false,
  addcompanyLoading: false,
  iseditcompany: false,
  addDepartmentLoading: false,
  addDesignationLoading: false,
  isaddbranch: false,
  isbranchUpdate: false,
  loadingworkerlist: false,
  loadingCompaniesList: false,
  loadingCompanyInfo: false,
  loadingCompanyBranches: false,
  loadingJob: false,
  jobsList: [],
  pendingCompanies: [],
  pendingCompLoading: false,
  mergeCompanyLoading: false,
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
>('adminPage/searchCompanies', async (type, { rejectWithValue }) => {
  try {
    const queryType = type ?? 'admin';
    const response = await orshAxios.get<CompanyResponse>(
      `/company/list?type=${queryType}`,
    );
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch companies');
  }
});

export const fetchPendingCompanies = createAsyncThunk<
  CompanyResponse,
  string | undefined
>('adminPage/pendingCompanies', async (_, { rejectWithValue }) => {
  try {
    const response =
      await orshAxios.get<CompanyResponse>(`/company/pendingList`);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch companies');
  }
});

export const mergePendingCompanies = createAsyncThunk<
  MergePendingCompaniesResponse,
  MergePendingCompaniesPayload,
  { rejectValue: string }
>('adminPage/mergePendingCompanies', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post<MergePendingCompaniesResponse>(
      '/company/mergeCompany',
      payload,
    );
    if (!response.data?.success) {
      const message = response.data?.message || 'Failed to merge companies';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      return rejectWithValue(message);
    }
    toast({
      title: 'Success',
      description: response.data.message || 'Companies merged successfully',
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Failed to merge companies';
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });
    return rejectWithValue(message);
  }
});

export const getJobsList = createAsyncThunk<any, void>(
  'adminPage/get/job',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orshAxios.get<any>(`/invitations/gets/jobs`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch jobs');
    }
  },
);

export const fetchDepartments = createAsyncThunk<DepartmentResponse, void>(
  'adminPage/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await orshAxios.get<DepartmentResponse>(`/fetch/departments`);
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
      const response =
        await orshAxios.get<DesignationResponse>(`/fetch/designations`);
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
>('adminPage/addDepartment', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('/fetch/addDepartment', payload);
    return response?.data ?? { success: false, message: 'No response' };
  } catch (error) {
    return rejectWithValue('Failed to add department');
  }
});

export const addDesignation = createAsyncThunk<
  { success: boolean; message: string; data?: Designation | null },
  { designationName: string },
  { rejectValue: string }
>('adminPage/addDesignation', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('/fetch/addDesignation', payload);
    return response?.data ?? { success: false, message: 'No response' };
  } catch (error) {
    return rejectWithValue('Failed to add designation');
  }
});

export const fetchMarriedStatus = createAsyncThunk<DesignationResponse, void>(
  'adminPage/fetchMarriedStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await orshAxios.get<DesignationResponse>(`/fetch/marriedStatus`);
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
      const response =
        await orshAxios.get<DesignationResponse>(`/fetch/states`);
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

/** Update worker profile image only - separate API from field update */
export const updateWorkerProfile = createAsyncThunk<
  UpdateEmployeeResponse,
  { empId: string; image: File },
  { rejectValue: string }
>(
  'adminPage/updateWorkerProfile',
  async ({ empId, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('empId', empId);
      formData.append('image', image);
      const response = await orshAxios.put('/worker/profile-update', formData);
      if (!response.data.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      } else {
        toast({
          title: 'Success',
          description: response.data.message ?? 'Profile photo updated',
        });
      }
      return response.data?.add ?? response.data;
    } catch {
      return rejectWithValue('Failed to update profile photo');
    }
  },
);

/** Update only current (present) address - different API flow */
export const updateEmployeeCurrentAddress = createAsyncThunk<
  UpdateEmployeeResponse,
  {
    empId: string;
    houseNoPresent: string;
    colonyPresent: string;
    cityPresent: string;
    statePresent: string;
    countryPresent: string;
    pinCodePresent: string;
  },
  { rejectValue: string }
>(
  'adminPage/updateEmployeeCurrentAddress',
  async (payload, { rejectWithValue }) => {
    const type = 'current';
    try {
      const response = await orshAxios.put(
        `worker/update/address?type=${type}`,
        payload,
      );
      if (!response.data?.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      } else {
        toast({
          title: 'Success',
          description: response.data.message ?? 'Current address updated',
        });
      }
      return response.data?.add ?? response.data;
    } catch (error) {
      return rejectWithValue('Failed to update current address');
    }
  },
);

/** Update only permanent address - different API flow */
export const updateEmployeePermanentAddress = createAsyncThunk<
  UpdateEmployeeResponse,
  {
    empId: string;
    houseNoPermanent: string;
    colonyPermanent: string;
    cityPermanent: string;
    statePermanent: string;
    countryPermanent: string;
    pinCodePermanent: string;
  },
  { rejectValue: string }
>(
  'adminPage/updateEmployeePermanentAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orshAxios.put(
        '/worker/update/address?type=permanent',
        payload,
      );
      if (!response.data?.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.data.message,
        });
      } else {
        toast({
          title: 'Success',
          description: response.data.message ?? 'Permanent address updated',
        });
      }
      return response.data?.add ?? response.data;
    } catch (error) {
      return rejectWithValue('Failed to update permanent address');
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
      console.log(error, 'error');
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
  { startDate: string; endDate: string }
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
/** Send WhatsApp invitation: selected workers (empCode + mobile + name arrays) + job, address, contact + date & time */
export interface ShareWorkersPayload {
  empCode: string[];
  mobile: string[];
  empName: string[];
  jobId: string;
  address: string;
  contact: string;
  date: string;
  time: string;
}

/** API response for send-whatsapp */
export interface ShareWorkersResponse {
  success: boolean;
  message: string;
  total: number;
  sent: number;
  failed: number;
  failedUsers?: Array<{ empCode: string; mobile: string; error: string }>;
}

export const shareWorkers = createAsyncThunk<
  ShareWorkersResponse,
  ShareWorkersPayload
>('adminPage/shareWorkers', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post(
      '/invitations/send-whatsapp',
      payload,
    );
    const data = response.data as ShareWorkersResponse;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to send.',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    return {
      success: data.success,
      message: data.message ?? 'WhatsApp sending completed',
      total: data.total ?? 0,
      sent: data.sent ?? 0,
      failed: data.failed ?? 0,
      failedUsers: data.failedUsers ?? [],
    };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to send';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

/** Push notification: title + message */
export const sendNotification = createAsyncThunk<
  { success: boolean; message: string },
  { title: string; message: string }
>('adminPage/sendNotification', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post(
      '/invitations/send-notification',
      payload,
    );
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to send notification.',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({
      title: 'Success',
      description: data.message || 'Notification sent.',
    });
    return { success: true, message: data.message };
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to send notification';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

/** Contractors: list, add, update */
export const fetchContractors = createAsyncThunk<ContractorListResponse, void>(
  'adminPage/fetchContractors',
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await orshAxios.get<ContractorListResponse>('/contractor/all');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch contractors');
    }
  },
);

export interface AddContractorPayload {
  name: string;
  panNo: string;
  email: string;
  mobile: string;
  contactMobile: string;
  contactName: string;
  gst: string;
  address: string;
}

export const addContractor = createAsyncThunk<
  { success: boolean; message: string; data?: Contractor },
  AddContractorPayload
>('adminPage/addContractor', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.post('/contractor/add', payload);
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to add contractor',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({
      title: 'Success',
      description: data.message || 'Contractor added.',
    });
    return data;
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to add contractor';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

export interface UpdateContractorPayload extends AddContractorPayload {
  contractorID: string;
  activeStatus?: string;
}

export const updateContractor = createAsyncThunk<
  { success: boolean; message: string; data?: Contractor },
  UpdateContractorPayload
>('adminPage/updateContractor', async (payload, { rejectWithValue }) => {
  try {
    const response = await orshAxios.put('/contractor/edit', payload);
    const data = response.data;
    if (!data?.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data?.message || 'Failed to update contractor',
      });
      return rejectWithValue(data?.message || 'Failed');
    }
    toast({
      title: 'Success',
      description: data.message || 'Contractor updated.',
    });
    return data;
  } catch (err: unknown) {
    const msg =
      (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || 'Failed to update contractor';
    toast({ variant: 'destructive', title: 'Error', description: msg });
    return rejectWithValue(msg);
  }
});

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

/** Fetch full worker details by key (empCode / employeeID) - GET /worker/details/:key */
export const fetchWorkerDetailsByKey = createAsyncThunk<
  WorkerDetailsApiResponse,
  string,
  { rejectValue: string }
>('adminPage/fetchWorkerDetailsByKey', async (key, { rejectWithValue }) => {
  try {
    const response = await orshAxios.get<
      { success?: boolean; message?: string } & WorkerDetailsApiResponse
    >(`/worker/details/${encodeURIComponent(key)}`);
    if (response.data?.success === false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          (response.data as any).message ?? 'Failed to load worker details',
      });
    }
    return response.data as WorkerDetailsApiResponse;
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to load worker details',
    });
    return rejectWithValue('Failed to fetch worker details');
  }
});

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

export const uploadFamilyPhoto = createAsyncThunk<
  any, // Define the type of the data you expect to return
  { file: File; id: string; type: string } // Define the type of the argument you expect
>('/client/uploadExcel', async ({ file, id, type }) => {
  const formData = new FormData();
  formData.append('familyPhoto', file); // Append the file to FormData
  formData.append('familyUid', id); // Append the channel to FormData
  formData.append('type', type); // Append the channel to FormData

  const response = await orshAxios.post('worker/familyPhoto', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set appropriate headers
    },
  });

  if (response.data.success === true) {
    toast({
      title: 'Success',
      description: response.data.message,
    });
  } else {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: response.data.message,
    });
  }

  return response.data;
});

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
      .addCase(shareWorkers.pending, (state) => {
        state.loading = true;
      })
      .addCase(shareWorkers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(shareWorkers.rejected, (state) => {
        state.loading = false;
      })
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendNotification.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchContractors.pending, (state) => {
        state.contractorLoading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractorLoading = false;
        state.contractors = action.payload.data ?? null;
      })
      .addCase(fetchContractors.rejected, (state) => {
        state.contractorLoading = false;
      })
      .addCase(addContractor.pending, (state) => {
        state.addContractorLoading = true;
      })
      .addCase(addContractor.fulfilled, (state) => {
        state.addContractorLoading = false;
      })
      .addCase(addContractor.rejected, (state) => {
        state.addContractorLoading = false;
      })
      .addCase(updateContractor.pending, (state) => {
        state.addContractorLoading = true;
      })
      .addCase(updateContractor.fulfilled, (state) => {
        state.addContractorLoading = false;
      })
      .addCase(updateContractor.rejected, (state) => {
        state.addContractorLoading = false;
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
        state.loadingCompaniesList = true;
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.loadingCompaniesList = false;
        state.error = null;
        state.companies = action.payload.data;
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.loadingCompaniesList = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPendingCompanies.pending, (state) => {
        state.pendingCompLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingCompanies.fulfilled, (state, action) => {
        state.pendingCompLoading = false;
        state.error = null;
        state.pendingCompanies = action.payload.data;
      })
      .addCase(fetchPendingCompanies.rejected, (state, action) => {
        state.pendingCompLoading = false;
        state.error = action.payload as string;
      })
      .addCase(mergePendingCompanies.pending, (state) => {
        state.mergeCompanyLoading = true;
        state.error = null;
      })
      .addCase(mergePendingCompanies.fulfilled, (state) => {
        state.mergeCompanyLoading = false;
        state.error = null;
      })
      .addCase(mergePendingCompanies.rejected, (state, action) => {
        state.mergeCompanyLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getJobsList.pending, (state) => {
        state.loadingJob = true;
        state.error = null;
      })
      .addCase(getJobsList.fulfilled, (state, action) => {
        state.loadingJob = false;
        state.error = null;
        state.jobsList = action.payload.data;
      })
      .addCase(getJobsList.rejected, (state, action) => {
        state.loadingJob = false;
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
        state.loadingworkerlist = true;
        state.error = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loadingworkerlist = false;
        state.error = null;
        state.workers = action.payload.data;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loadingworkerlist = false;
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
        state.loadingCompanyBranches = true;
        state.error = null;
      })
      .addCase(getCompanyBranchOptions.fulfilled, (state, action) => {
        state.loadingCompanyBranches = false;
        state.error = null;
        state.branches = action.payload.data;
      })
      .addCase(getCompanyBranchOptions.rejected, (state, action) => {
        state.loadingCompanyBranches = false;
        state.error = action.payload as string;
        state.branches = [];
      })
      .addCase(getCompanyInfo.pending, (state) => {
        state.loadingCompanyInfo = true;
        state.error = null;
      })
      .addCase(getCompanyInfo.fulfilled, (state, action) => {
        state.loadingCompanyInfo = false;
        state.error = null;
        state.companyInfo = action.payload.data;
      })
      .addCase(getCompanyInfo.rejected, (state, action) => {
        state.loadingCompanyInfo = false;
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
      })
      .addCase(addBranch.pending, (state) => {
        state.isaddbranch = true;
        state.error = null;
      })
      .addCase(addBranch.fulfilled, (state) => {
        state.isaddbranch = false;

        state.error = null;
      })
      .addCase(addBranch.rejected, (state, action) => {
        state.isaddbranch = false;
        state.error = action.payload as string;
      })
      .addCase(branchUpdate.pending, (state) => {
        state.isbranchUpdate = true;
        state.error = null;
      })
      .addCase(branchUpdate.fulfilled, (state) => {
        state.isbranchUpdate = false;

        state.error = null;
      })
      .addCase(branchUpdate.rejected, (state, action) => {
        state.isbranchUpdate = false;
        state.error = action.payload as string;
      });
  },
});

export default adminPageSlice.reducer;
