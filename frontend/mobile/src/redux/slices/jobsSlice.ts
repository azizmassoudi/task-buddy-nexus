import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../../lib/api';
import { Job, JobCreate, StatusEnum } from '../types';



interface JobsState {
  currentJob: Job | null;
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  currentJob: null,
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData: JobCreate, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.create(jobData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await jobsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchById',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getById(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch job');
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  'jobs/updateStatus',
  async ({ id, status }: { id: number; status: StatusEnum }, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.updateStatus(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 
        'Failed to update job status'
      );
    }
  }
);

export const claimJob = createAsyncThunk(
  'jobs/claim',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.claimJob(jobId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        if (state.currentJob?.id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) state.jobs[index] = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) state.jobs[index] = action.payload;
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(claimJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) state.jobs[index] = action.payload;
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      });
  },
});

export const { clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;