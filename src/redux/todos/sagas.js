import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_TODOS_REQUEST,
  fetchTodosSuccess,
  fetchTodosFailure,
} from './actions';

const fetchTodosApi = () =>
  fetch('https://jsonplaceholder.typicode.com/todos').then((res) => res.json());

function* fetchTodosSaga() {
  try {
    const todos = yield call(fetchTodosApi);
    yield put(fetchTodosSuccess(todos));
  } catch (error) {
    yield put(fetchTodosFailure(error.message));
  }
}

export function* todosRootSaga() {
  yield takeLatest(FETCH_TODOS_REQUEST, fetchTodosSaga);
}