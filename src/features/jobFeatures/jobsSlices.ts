import { orshAxios } from '@/axiosIntercepter';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/** Payload for PATCH /job/updateJob – jobId plus editable job fields only (aligned with Create Job) */
export interface UpdateJobPayload {
  UniqueID: string;
  company?: string;
  address?: string;
  jobTitle: string;
  jobType: string;
  department: string;
  designation: string;
  minSalary: number;
  maxSalary: number;
  experience: string;
  jobStatus: string;
  skills?: string;
  qualification?: string;
  jobDescription?: string;
  facilities?: string;
}

interface initialStateType {
  isUpdateLoading: boolean;
  isDeleteLoading: boolean
}

const initialState: initialStateType = {
  isUpdateLoading: false,
  isDeleteLoading: false
};

export const updatejobs = createAsyncThunk<
  any,
  UpdateJobPayload
>('adminPage/update/job', async (payload: UpdateJobPayload) => {
  const response = await orshAxios.patch('/job/updateJob', payload);
  return response?.data;
});
export const deleteJob = createAsyncThunk<
  any,
  UpdateJobPayload
>('adminPage/delete/job', async (payload: any) => {
  const response = await orshAxios.post('/job/deleteJob', payload);
  return response?.data;
});






// Create the slice
const jobSlice = createSlice({
  name: 'adminPage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
         .addCase(updatejobs.pending, (state) => {
        state.isUpdateLoading = true;
      })
      .addCase(updatejobs.fulfilled, (state) => {
        state.isUpdateLoading = false;
      })
      .addCase(updatejobs.rejected, (state) => {
        state.isUpdateLoading = false;
      })
            .addCase(deleteJob.pending, (state) => {
        state.isDeleteLoading = true;
      })
      .addCase(deleteJob.fulfilled, (state) => {
        state.isDeleteLoading = false;
      })
      .addCase(deleteJob.rejected, (state) => {
        state.isDeleteLoading = false;
      })
  
  },
});

export default jobSlice.reducer;
