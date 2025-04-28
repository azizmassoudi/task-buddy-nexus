import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesAPI } from '../../lib/api';
import { ServiceCategory, ServiceStatus } from '../../data/mockServices';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  location: string;
  status: ServiceStatus;
  postedBy: string;
  postedDate: string;
  imageUrl?: string;
  estimatedHours?: number;
  skills?: string[];
}

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.create(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, data }: { id: string; data: Partial<Service> }, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await servicesAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Service
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      // Delete Service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service.id !== action.payload);
      })
      // Fetch Service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentService } = servicesSlice.actions;
export default servicesSlice.reducer; 