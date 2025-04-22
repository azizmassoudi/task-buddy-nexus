import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messagesAPI } from '../../lib/api';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  jobId: string;
  createdAt: string;
}

interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/create',
  async (messageData: Omit<Message, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.create(messageData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMessage = createAsyncThunk(
  'messages/update',
  async ({ id, data }: { id: string; data: Partial<Message> }, { rejectWithValue }) => {
    try {
      const response = await messagesAPI.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await messagesAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Message
      .addCase(createMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      // Update Message
      .addCase(updateMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(message => message.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      // Delete Message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(message => message.id !== action.payload);
      });
  },
});

export default messagesSlice.reducer; 