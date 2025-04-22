import { takeLatest, put, call } from 'redux-saga/effects';
import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import { User } from '../types';

// Mock API call - replace with actual API call
const loginApi = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  return {
    id: '1',
    email,
    name: 'Test User',
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