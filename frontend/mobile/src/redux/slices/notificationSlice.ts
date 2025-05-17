import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../lib/api';
import { User } from '../types'; // Assuming User is imported from types for type consistency

interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface NotificationCreate {
  user_id: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user) {
        return rejectWithValue('User must be logged in to fetch notifications');
      }

      const response = await notificationAPI.getNotifications();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to access this resource');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (notificationId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user) {
        return rejectWithValue('User must be logged in to mark notifications as read');
      }

      await notificationAPI.markNotificationAsRead(notificationId.toString());
      return notificationId;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllNotificationsAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user) {
        return rejectWithValue('User must be logged in to mark notifications as read');
      }

      await notificationAPI.markAllNotificationsAsRead();
      return true;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark all notifications as read');
    }
  }
);

export const createNotification = createAsyncThunk(
  'notification/createNotification',
  async (notificationData: NotificationCreate, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: { user: User | null } };
      const user = state.auth.user;

      if (!user) {
        return rejectWithValue('User must be logged in to create notifications');
      }

      if (!user.is_superuser) {
        return rejectWithValue('Only admins can create notifications');
      }

      const response = await notificationAPI.createNotification(notificationData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue('You do not have permission to perform this action');
      }
      return rejectWithValue(error.response?.data?.detail || 'Failed to create notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.notifications.findIndex((n) => n.id === action.payload);
        if (index !== -1) {
          state.notifications[index].is_read = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notifications.push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = notificationSlice.actions;

export default notificationSlice.reducer;