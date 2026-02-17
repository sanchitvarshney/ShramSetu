import { orshAxios } from '@/axiosIntercepter';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export type ApplicationStatus = 'pending' | 'accepted' | 'declined' | 'hold';

export interface JobApplication {
  id?: string;
  key?: string;
  applicantName?: string;
  empName?: string;
  email?: string;
  empEmail?: string;
  mobile?: string;
  empMobile?: string;
  jobTitle?: string;
  jobId?: string;
  companyName?: string;
  company?: string;
  appliedDate?: string;
  insertDt?: string;
  status: string;
  experience?: string;
  resumeUrl?: string;
  minSalary?: number;
  maxSalary?: number;
  [key: string]: any;
}

/** Full applicant/employee details from API (resume-style) */
export interface ApplicantDetail {
  key?: string;
  applicantName?: string;
  empName?: string;
  empEmail?: string;
  empMobile?: string;
  empDOB?: string;
  empGender?: string;
  address?: string;
  jobTitle?: string;
  company?: string;
  insertDt?: string;
  status?: string;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  qualification?: string;
  skills?: string;
  education?: string;
  previousCompany?: string;
  designation?: string;
  department?: string;
  [key: string]: any;
}

interface JobApplicationsState {
  applications: JobApplication[];
  applicationDetails: ApplicantDetail | null;
  applicationDetailsLoading: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: JobApplicationsState = {
  applications: [],
  applicationDetails: null,
  applicationDetailsLoading: false,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const fetchJobApplications = createAsyncThunk<
  { data: JobApplication[] },
  void
>('jobApplications/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await orshAxios.get<{
      data: JobApplication[];
      success: boolean;
    }>('/job/getAppliedJobs');
    if (response.data?.success && Array.isArray(response.data?.data)) {
      return { data: response.data.data };
    }
    return { data: [] };
  } catch (err: any) {
    if (err?.response?.status === 404 || !err?.response) {
      return { data: [] };
    }
    return rejectWithValue(err?.message ?? 'Failed to fetch applications');
  }
});

export const updateApplicationStatus = createAsyncThunk<
  { id: string; status: ApplicationStatus },
  { appliedKey: string; status: ApplicationStatus }
>(
  'jobApplications/updateStatus',
  async ({ appliedKey, status }, { rejectWithValue }) => {
    const stautsData = status === 'accepted' ? 'APR' : status === 'declined' ? 'REJ' : 'HOLD';
    try {
      await orshAxios.post('/job/updateAppliedJobStatus', {
        appliedKey,
        status: stautsData,
      });
      return { id: appliedKey, status };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? 'Failed to update status');
    }
  },
);

export const fetchApplicationDetails = createAsyncThunk<
  ApplicantDetail,
  string
>('jobApplications/fetchDetails', async (key, { rejectWithValue }) => {
  try {
    const response = await orshAxios.get<{ data: ApplicantDetail; success: boolean }>(
      `/job/getEmpJobsDetails/${key}`,
      
    );
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return rejectWithValue('No details found');
  } catch (err: any) {
    return rejectWithValue(err?.message ?? 'Failed to fetch details');
  }
});

const jobApplicationsSlice = createSlice({
  name: 'jobApplications',
  initialState,
  reducers: {
    setApplicationStatusLocal: (
      state,
      action: { payload: { id: string; status: ApplicationStatus } },
    ) => {
      const app = state.applications.find(
        (a) => (a as any).key === action.payload.id || a.id === action.payload.id,
      );
      if (app) app.status = action.payload.status;
    },
    clearApplicationDetails: (state) => {
      state.applicationDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data ?? [];
        state.error = null;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Failed to fetch';
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const app = state.applications.find(
          (a) => (a as any).key === action.payload.id || a.id === action.payload.id,
        );
        if (app) app.status = action.payload.status;
      })
      .addCase(updateApplicationStatus.rejected, (state) => {
        state.isUpdating = false;
      })
      .addCase(fetchApplicationDetails.pending, (state) => {
        state.applicationDetailsLoading = true;
        state.applicationDetails = null;
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action) => {
        state.applicationDetailsLoading = false;
        state.applicationDetails = action.payload;
      })
      .addCase(fetchApplicationDetails.rejected, (state) => {
        state.applicationDetailsLoading = false;
        state.applicationDetails = null;
      });
  },
});

export const { setApplicationStatusLocal, clearApplicationDetails } =
  jobApplicationsSlice.actions;
export default jobApplicationsSlice.reducer;
