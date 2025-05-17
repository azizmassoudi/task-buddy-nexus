// serviceRequestSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceRequestAPI } from '../../lib/api';

import { User, Job, StatusEnum } from '../types';

interface ServiceRequest {
  id: number;
  service_id: number;
  subcontractor_id: number;
  status: StatusEnum;
  message: string;
  admin_notes?: string;
  proposed_price: number;
  created_at: string;
  service: {
    title: string;
    description: string;
    price: number;
    category: string;
  };
  subcontractor: {
    id: number;
    username: string;
    email: string;
  };
  job?: Job;
}

interface ServiceRequestState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceRequestState = {
  requests: [],
  loading: false,
  error: null,
};

export const createServiceRequest = createAsyncThunk(
  'serviceRequests/create',
  async (requestData: {
    service_id: number;
    subcontractor_id:number;
    message: string;
    proposed_price: number;
  }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User } };
      if (state.auth.user.role !== 'subcontractor') {
        return rejectWithValue('Only subcontractors can create requests');
      }

      // Additional client-side validation
      if (requestData.proposed_price <= 0) {
        return rejectWithValue('Proposed price must be greater than 0');
      }

      const response = await serviceRequestAPI.create(requestData);
      return response.data;
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      // Handle specific error messages
      if (detail?.includes('service_id')) {
        return rejectWithValue('Invalid service selection');
      }
      return rejectWithValue(detail || 'Failed to create request');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'serviceRequests/updateStatus',
  async (
    { requestId, status, adminNotes }: { requestId: number; status: StatusEnum; adminNotes?: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: { user: User } };
      if (state.auth.user.role !== 'admin') {
        return rejectWithValue('Only admins can update request status');
      }
      // Update the API method to accept arbitrary data
      const response = await serviceRequestAPI.updateStatus(
        requestId,
        { status_update: status, admin_notes: adminNotes } as any // allow extra key
      );
      if (status === 'Approved') {
        return {
          request: response.data.request,
          job: response.data.job
        };
      }
      return { request: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update status');
    }
  }
);

export const fetchAllServiceRequests = createAsyncThunk(
  'serviceRequests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serviceRequestAPI.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch service requests');
    }
  }
);

const serviceRequestSlice = createSlice({
  name: 'serviceRequests',
  initialState,
  reducers: {
    clearRequestsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Request
      .addCase(createServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload);
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Status
      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requests.findIndex(
          req => req.id === action.payload.request.id
        );
        
        if (index !== -1) {
          state.requests[index] = action.payload.request;
          
          if (action.payload.job) {
            state.requests[index].job = action.payload.job;
          }
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        // Convert error object to string if needed
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (
          action.payload &&
          typeof action.payload === 'object' &&
          'msg' in action.payload
        ) {
          state.error = (action.payload as { msg: string }).msg;
        } else if (action.payload && Array.isArray(action.payload)) {
          // If it's an array of error objects
          state.error = action.payload.map((e: any) => e.msg).join(', ');
        } else {
          state.error = 'Failed to update request status';
        }
      })

      // Fetch All Service Requests
      .addCase(fetchAllServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServiceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAllServiceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
});

export const { clearRequestsError } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;