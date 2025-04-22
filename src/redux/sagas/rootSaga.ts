import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { taskSaga } from './taskSaga';
import { projectSaga } from './projectSaga';

export function* rootSaga() {
  yield all([
    authSaga(),
    taskSaga(),
    projectSaga(),
  ]);
} 