import { takeLatest, put, call } from 'redux-saga/effects';
import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import { UserRole } from '../../contexts/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

// Mock API call - replace with actual API call
const loginApi = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  return {
    id: '1',
    username: 'testuser',
    email,
    full_name: 'Test User',
    role: 'client',
    is_active: true,
    is_superuser: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

function* handleLogin(action: ReturnType<typeof loginStart>) {
  try {
    // In a real app, you would get credentials from the action payload
    const user: User = yield call(loginApi, 'test@example.com', 'password');
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : 'Login failed'));
  }
}

function* handleLogout() {
  try {
    // Add any cleanup logic here
    yield put(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export function* authSaga() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
} 