import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
} from './actions';

// This is the API call itself
const fetchUsersApi = () =>
  fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json());

// This is the worker saga — it does the actual work
function* fetchUsersSaga() {
  try {
    const users = yield call(fetchUsersApi);
    
    // Duplicate the data to fake more rows with unique IDs
    const duplicated = [
      ...users,
      ...users.map((u) => ({ ...u, id: u.id + 10, name: u.name + ' II' })),
      ...users.map((u) => ({ ...u, id: u.id + 20, name: u.name + ' III' })),
      ...users.map((u) => ({ ...u, id: u.id + 30, name: u.name + ' IV' })),
      ...users.map((u) => ({ ...u, id: u.id + 40, name: u.name + ' V' })),
    ];

    yield put(fetchUsersSuccess(duplicated));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

// This is the watcher saga — it watches for actions and triggers the worker
function* rootSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}

export default rootSaga;