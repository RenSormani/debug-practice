import { call, put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_POSTS_REQUEST,
  fetchPostsSuccess,
  fetchPostsFailure,
} from './actions';

const fetchPostsApi = () =>
  fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json());

function* fetchPostsSaga() {
  try {
    const posts = yield call(fetchPostsApi);
    yield put(fetchPostsSuccess(posts));
  } catch (error) {
    yield put(fetchPostsFailure(error.message));
  }
}

export function* postsRootSaga() {
  yield takeLatest(FETCH_POSTS_REQUEST, fetchPostsSaga);
}