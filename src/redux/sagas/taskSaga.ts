import { takeLatest, put, call } from 'redux-saga/effects';
import { 
  setTasks, 
  addTask, 
  updateTask, 
  deleteTask,
  setLoading,
  setError 
} from '../slices/taskSlice';
import { Task } from '../types';

// Mock API calls - replace with actual API calls
const fetchTasksApi = async (): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [];
};

const createTaskApi = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateTaskApi = async (task: Task): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...task,
    updatedAt: new Date().toISOString(),
  };
};

const deleteTaskApi = async (taskId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

function* handleFetchTasks() {
  try {
    yield put(setLoading(true));
    const tasks: Task[] = yield call(fetchTasksApi);
    yield put(setTasks(tasks));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to fetch tasks'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleCreateTask(action: ReturnType<typeof addTask>) {
  try {
    yield put(setLoading(true));
    const newTask: Task = yield call(createTaskApi, action.payload);
    yield put(addTask(newTask));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to create task'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleUpdateTask(action: ReturnType<typeof updateTask>) {
  try {
    yield put(setLoading(true));
    const updatedTask: Task = yield call(updateTaskApi, action.payload);
    yield put(updateTask(updatedTask));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to update task'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleDeleteTask(action: ReturnType<typeof deleteTask>) {
  try {
    yield put(setLoading(true));
    yield call(deleteTaskApi, action.payload);
    yield put(deleteTask(action.payload));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to delete task'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* taskSaga() {
  yield takeLatest('tasks/fetchTasks', handleFetchTasks);
  yield takeLatest(addTask.type, handleCreateTask);
  yield takeLatest(updateTask.type, handleUpdateTask);
  yield takeLatest(deleteTask.type, handleDeleteTask);
} 