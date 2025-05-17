// skillsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { Skill } from '../types';
import { skillAPI } from '../../lib/api';

interface SkillsState {
  skills: Skill[];
  userSkills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillsState = {
  skills: [],
  userSkills: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchAllSkills = createAsyncThunk(
  'skills/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await skillAPI.getAllSkills();
      return response.data;
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

export const createSkill = createAsyncThunk(
  'skills/create',
  async (name: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: any } };
      if (!state.auth.user?.is_superuser) {
        return rejectWithValue('Only admins can create skills');
      }
      
      const response = await skillAPI.createSkill({ name });
      return response.data;
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/delete',
  async (skillId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: any } };
      if (!state.auth.user?.is_superuser) {
        return rejectWithValue('Only admins can delete skills');
      }

      await skillAPI.deleteSkill(skillId);
      return skillId;
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

export const fetchUserSkills = createAsyncThunk(
  'skills/fetchUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await skillAPI.getUserSkills(userId);
      return response.data;
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

export const addUserSkill = createAsyncThunk(
  'skills/addUser',
  async ({ userId, skillId }: { userId: string; skillId: number }, { rejectWithValue }) => {
    try {
      const response = await skillAPI.addSkillToUser(userId, skillId);
      return response.data;
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

export const removeUserSkill = createAsyncThunk(
  'skills/removeUser',
  async ({ userId, skillId }: { userId: string; skillId: number }, { rejectWithValue }) => {
    try {
      const response = await skillAPI.removeSkillFromUser(userId, skillId);
      return response.data; // Should return the updated skills list
    } catch (error: any) {
      return handleSkillError(error, rejectWithValue);
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    clearSkillError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // General skill operations
      .addCase(fetchAllSkills.pending, handlePending)
      .addCase(fetchAllSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
        state.loading = false;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter(skill => skill.id !== action.payload);
        state.loading = false;
      })
      
      // User skill operations
      .addCase(fetchUserSkills.pending, handlePending)
      .addCase(fetchUserSkills.fulfilled, (state, action) => {
        state.userSkills = action.payload;
        state.loading = false;
      })
      .addCase(addUserSkill.fulfilled, (state, action) => {
        // Replace with the updated list from backend
        state.userSkills = action.payload;
        state.loading = false;
      })
      .addCase(removeUserSkill.fulfilled, (state, action) => {
        // Replace with the updated list from backend
        state.userSkills = action.payload;
        state.loading = false;
      })
      
      // Error handling
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejectedWithValue, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = (typeof action.payload === 'string') ? action.payload : 'Skill operation failed';
      });
  },
});

// Helper functions
const handlePending = (state: SkillsState) => {
  state.loading = true;
  state.error = null;
};

const isPending = (action: any) => action.type.endsWith('/pending');
const isRejected = (action: any) => action.type.endsWith('/rejected');

const handleSkillError = (error: any, rejectWithValue: any) => {
  if (error.response) {
    return rejectWithValue(error.response.data.detail || 'Skill operation failed');
  }
  return rejectWithValue(error.message || 'Skill operation failed');
};

export const { clearSkillError } = skillsSlice.actions;
export default skillsSlice.reducer;