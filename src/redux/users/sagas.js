import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_USERS_REQUEST,
  fetchUsersSuccess,
  fetchUsersFailure,
} from './actions';

const fetchUsersApi = () =>
  fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json());

function* fetchUsersSaga() {
  try {
    const users = yield call(fetchUsersApi);
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

export function* usersRootSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}