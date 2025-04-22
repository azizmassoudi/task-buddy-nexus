import { takeLatest, put, call } from 'redux-saga/effects';
import { 
  setProjects, 
  addProject, 
  updateProject, 
  deleteProject,
  setLoading,
  setError 
} from '../slices/projectSlice';
import { Project } from '../types';

// Mock API calls - replace with actual API calls
const fetchProjectsApi = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [];
};

const createProjectApi = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateProjectApi = async (project: Project): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...project,
    updatedAt: new Date().toISOString(),
  };
};

const deleteProjectApi = async (projectId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

function* handleFetchProjects() {
  try {
    yield put(setLoading(true));
    const projects: Project[] = yield call(fetchProjectsApi);
    yield put(setProjects(projects));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to fetch projects'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleCreateProject(action: ReturnType<typeof addProject>) {
  try {
    yield put(setLoading(true));
    const newProject: Project = yield call(createProjectApi, action.payload);
    yield put(addProject(newProject));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to create project'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleUpdateProject(action: ReturnType<typeof updateProject>) {
  try {
    yield put(setLoading(true));
    const updatedProject: Project = yield call(updateProjectApi, action.payload);
    yield put(updateProject(updatedProject));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to update project'));
  } finally {
    yield put(setLoading(false));
  }
}

function* handleDeleteProject(action: ReturnType<typeof deleteProject>) {
  try {
    yield put(setLoading(true));
    yield call(deleteProjectApi, action.payload);
    yield put(deleteProject(action.payload));
  } catch (error) {
    yield put(setError(error instanceof Error ? error.message : 'Failed to delete project'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* projectSaga() {
  yield takeLatest('projects/fetchProjects', handleFetchProjects);
  yield takeLatest(addProject.type, handleCreateProject);
  yield takeLatest(updateProject.type, handleUpdateProject);
  yield takeLatest(deleteProject.type, handleDeleteProject);
} 