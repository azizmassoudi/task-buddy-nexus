import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../../lib/api';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  clientId: string;
  freelancerId?: string;
  serviceId: string;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
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
  async (jobData: Omit<Job, 'id' | 'status' | 'freelancerId'>, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.create(jobData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, data }: { id: string; data: Partial<Job> }, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await jobsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
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
      // Create Job
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
      });
  },
});

export default jobsSlice.reducer; 