import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserRole } from '../../contexts/AuthContext';
import { authAPI, userAPI } from '../../lib/api';
import { User } from '../types';


interface UpdateUserProfile {
  username?: string;
  email?: string;
  full_name?: string;
  avatar?: string;
  avg_rating?:number
}

interface UserState {
  user:User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user:null,
  users: [],
  loading: false,
  error: null,
};

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (profileData: UpdateUserProfile, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateUserProfile(profileData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data.detail || 'Failed to update profile');
      } else if (error.request) {
        return rejectWithValue('Network error: Please check your connection');
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser || !currentUser.is_superuser) {
        return rejectWithValue('Only admins can delete users');
      }

      await userAPI.deleteUser(userId);
      return userId;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete user');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async (
    { userId, role }: { userId: string; role: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser || !currentUser.is_superuser) {
        return rejectWithValue('Only admins can update user roles');
      }

      // ✅ Extract the string value from the UserRole object
      console.log(userId, role)
      const response = await userAPI.updateUserRole(userId, role);
      
      return response.data;
      
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to update user role');
    }
  }
);
export const uploadCV = createAsyncThunk(
  'user/uploadCV',
  async (file: { uri: string; name: string; type: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const currentUser = state.auth.user;

      if (!currentUser) {
        return rejectWithValue('User must be logged in to upload CV');
      }
      const formData = new FormData();
      formData.append('cv', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
      const response = await userAPI.uploadCV(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to upload CV');
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user || !user.is_superuser) {
        return rejectWithValue('Only admins can fetch all users');
      }

      const response = await userAPI.getAllUsers();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to access this resource');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user || !user.is_superuser) {
        return rejectWithValue('Only admins can fetch user details');
      }

      const response = await userAPI.getUserById(userId);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to access this resource');
      } else if (error.response?.status === 404) {
        return rejectWithValue('User not found');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;