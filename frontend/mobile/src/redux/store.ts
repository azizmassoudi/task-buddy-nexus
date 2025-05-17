import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice';
import jobsReducer from './slices/jobsSlice';
import messagesReducer from './slices/messagesSlice';
import userReducer from './slices/userSlice'
import aboutReducer from './slices/aboutSlice'
import notificationsReducer from './slices/notificationSlice'
import skillsReducer from './slices/skillsSlice'
import serviceRequestsReducer from './slices/service_requestSlice';
import { setupApiInterceptors } from '../lib/api';

// Combine all reducer
const rootReducer = combineReducers({
  auth: authReducer,
  services: servicesReducer,
  jobs: jobsReducer,
  messages: messagesReducer,
  user:userReducer,
  about:aboutReducer,
  notifications:notificationsReducer,
  skills:skillsReducer,
  serviceRequests:serviceRequestsReducer
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Persist only the 'auth' reducer
};

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// After store is created, set up API interceptors to avoid require cycle
setupApiInterceptors(store);

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;