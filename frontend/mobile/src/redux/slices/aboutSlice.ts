import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '../types';
import { aboutAPI } from '../../lib/api';

interface About {
  id: string;
  content: string;
  userId: string;
  created_at: string;
  updated_at: string;
}

interface AboutState {
  abouts: About[];
  currentAbout: About | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  abouts: [],
  currentAbout: null,
  loading: false,
  error: null,
};

export const fetchAbouts = createAsyncThunk(
  'about/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aboutAPI.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch abouts');
    }
  }
);

export const fetchAboutByUserId = createAsyncThunk(
  'about/fetchByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await aboutAPI.getByUserId(userId);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch about');
    }
  }
);

export const createAbout = createAsyncThunk(
  'about/create',
  async (data: { content: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('User must be logged in to create about');
      }

      const response = await aboutAPI.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create about');
    }
  }
);

export const updateAbout = createAsyncThunk(
  'about/update',
  async ({ userId, data }: { userId: string; data: { content: string } }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser || currentUser.id !== userId) {
        return rejectWithValue('Not authorized to update this about');
      }

      const response = await aboutAPI.update(userId, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to update about');
    }
  }
);

export const deleteAbout = createAsyncThunk(
  'about/delete',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser || currentUser.id !== userId) {
        return rejectWithValue('Not authorized to delete this about');
      }

      await aboutAPI.delete(userId);
      return userId;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete about');
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    clearCurrentAbout: (state) => {
      state.currentAbout = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Abouts
      .addCase(fetchAbouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbouts.fulfilled, (state, action) => {
        state.loading = false;
        state.abouts = action.payload;
      })
      .addCase(fetchAbouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch About by User ID
      .addCase(fetchAboutByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAbout = action.payload;
      })
      .addCase(fetchAboutByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create About
      .addCase(createAbout.fulfilled, (state, action) => {
        state.abouts.push(action.payload);
        state.currentAbout = action.payload;
      })
      // Update About
      .addCase(updateAbout.fulfilled, (state, action) => {
        const index = state.abouts.findIndex(about => about.userId === action.payload.userId);
        if (index !== -1) {
          state.abouts[index] = action.payload;
        }
        state.currentAbout = action.payload;
      })
      // Delete About
      .addCase(deleteAbout.fulfilled, (state, action) => {
        state.abouts = state.abouts.filter(about => about.userId !== action.payload);
        state.currentAbout = null;
      });
  },
});

export const { clearCurrentAbout } = aboutSlice.actions;
export default aboutSlice.reducer;